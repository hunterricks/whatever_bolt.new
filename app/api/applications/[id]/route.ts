import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/mysql';
import { NextRequest } from 'next/server';
import { sendNotification } from '@/lib/sendNotification';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await query(`
      SELECT 
        a.*,
        j.title as job_title,
        j.description as job_description,
        j.budget as job_budget,
        j.location as job_location,
        j.status as job_status,
        u.name as contractor_name
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN users u ON a.contractor_id = u.id
      WHERE a.id = ?
    `, [params.id]);

    if (!application.length) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application[0]);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Error fetching application' },
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
      // Get application details
      const [application] = await connection.query(
        'SELECT * FROM applications WHERE id = ?',
        [params.id]
      );

      if (!application) {
        throw new Error('Application not found');
      }

      if (status === 'accepted') {
        // Update job status
        await connection.query(
          'UPDATE jobs SET status = "in_progress" WHERE id = ?',
          [application.job_id]
        );

        // Reject other pending applications
        await connection.query(`
          UPDATE applications 
          SET status = 'rejected' 
          WHERE job_id = ? 
          AND id != ? 
          AND status = 'pending'
        `, [application.job_id, params.id]);

        // Notify contractor
        await sendNotification(
          application.contractor_id,
          'Application Accepted',
          'Your job application has been accepted!'
        );
      } else if (status === 'rejected') {
        // Notify contractor
        await sendNotification(
          application.contractor_id,
          'Application Status Update',
          'Your job application was not selected'
        );
      }

      // Update application status
      await connection.query(
        'UPDATE applications SET status = ? WHERE id = ?',
        [status, params.id]
      );
    });

    const [updatedApplication] = await query(
      'SELECT * FROM applications WHERE id = ?',
      [params.id]
    );

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Error updating application' },
      { status: 500 }
    );
  }
}