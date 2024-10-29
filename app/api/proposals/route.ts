import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/mysql';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const proposalId = uuidv4();

    // Check if the job exists and is still open
    const jobs = await query(
      'SELECT status FROM jobs WHERE id = ?',
      [body.jobId]
    );

    if (!jobs.length) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (jobs[0].status !== 'open') {
      return NextResponse.json(
        { error: 'Job is no longer accepting proposals' },
        { status: 400 }
      );
    }

    // Check for existing proposal
    const existingProposals = await query(
      'SELECT id FROM proposals WHERE job_id = ? AND contractor_id = ?',
      [body.jobId, body.contractorId]
    );

    if (existingProposals.length > 0) {
      return NextResponse.json(
        { error: 'You have already submitted a proposal for this job' },
        { status: 400 }
      );
    }

    // Create new proposal
    await query(`
      INSERT INTO proposals (
        id, job_id, contractor_id, price,
        cover_letter, estimated_duration, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
    `, [
      proposalId,
      body.jobId,
      body.contractorId,
      body.price,
      body.coverLetter,
      body.estimatedDuration
    ]);

    const [newProposal] = await query(
      'SELECT * FROM proposals WHERE id = ?',
      [proposalId]
    );

    return NextResponse.json(newProposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Error creating proposal' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const contractorId = searchParams.get('contractorId');

    let conditions = [];
    const params: any[] = [];

    // Add conditions based on query parameters
    if (jobId) {
      conditions.push('p.job_id = ?');
      params.push(jobId);
    }
    if (contractorId) {
      conditions.push('p.contractor_id = ?');
      params.push(contractorId);
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    // Enhanced query to include more job and contractor details
    const proposals = await query(`
      SELECT 
        p.*,
        j.title as job_title,
        j.description as job_description,
        j.budget as job_budget,
        j.location as job_location,
        j.status as job_status,
        j.posted_by as job_poster_id,
        u.name as contractor_name,
        u2.name as job_poster_name
      FROM proposals p
      LEFT JOIN jobs j ON p.job_id = j.id
      LEFT JOIN users u ON p.contractor_id = u.id
      LEFT JOIN users u2 ON j.posted_by = u2.id
      ${whereClause}
      ORDER BY p.created_at DESC
    `, params);

    // Transform the proposals to include nested job object
    const transformedProposals = proposals.map(proposal => ({
      ...proposal,
      job: {
        _id: proposal.job_id,
        title: proposal.job_title,
        description: proposal.job_description,
        budget: proposal.job_budget,
        location: proposal.job_location,
        status: proposal.job_status,
        postedBy: {
          _id: proposal.job_poster_id,
          name: proposal.job_poster_name
        }
      },
      contractor: {
        _id: proposal.contractor_id,
        name: proposal.contractor_name
      }
    }));

    return NextResponse.json(transformedProposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Error fetching proposals' },
      { status: 500 }
    );
  }
}
