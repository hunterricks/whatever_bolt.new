import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/mysql';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await query(`
      SELECT 
        p.*,
        j.*,
        u.name as contractor_name
      FROM proposals p
      LEFT JOIN jobs j ON p.job_id = j.id
      LEFT JOIN users u ON p.contractor_id = u.id
      WHERE p.id = ?
    `, [params.id]);

    if (!proposal.length) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json(proposal[0]);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Error fetching proposal' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    await transaction(async (connection) => {
      // Get proposal and job details
      const [proposal] = await connection.query(
        'SELECT * FROM proposals WHERE id = ?',
        [params.id]
      );

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      if (status === 'accepted') {
        // Update job status
        await connection.query(
          'UPDATE jobs SET status = "in_progress" WHERE id = ?',
          [proposal.job_id]
        );

        // Reject other pending proposals
        await connection.query(`
          UPDATE proposals 
          SET status = 'rejected' 
          WHERE job_id = ? 
          AND id != ? 
          AND status = 'pending'
        `, [proposal.job_id, params.id]);
      }

      // Update proposal status
      await connection.query(
        'UPDATE proposals SET status = ? WHERE id = ?',
        [status, params.id]
      );
    });

    const [updatedProposal] = await query(
      'SELECT * FROM proposals WHERE id = ?',
      [params.id]
    );

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Error updating proposal' },
      { status: 500 }
    );
  }
}
