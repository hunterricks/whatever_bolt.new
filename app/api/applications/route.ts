import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/mysql';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendNotification } from '@/lib/sendNotification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const applicationId = uuidv4();

    // Check if the job exists and is still open
    const jobs = await query(
      'SELECT status, posted_by FROM jobs WHERE id = ?',
      [body.jobId]
    );

    if (!jobs.length) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (jobs[0].status !== 'open') {
      return NextResponse.json(
        { error: 'Job is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Check for existing application
    const existingApplications = await query(
      'SELECT id FROM applications WHERE job_id = ? AND contractor_id = ?',
      [body.jobId, body.contractorId]
    );

    if (existingApplications.length > 0) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    // Create new application
    await transaction(async (connection) => {
      await connection.execute(`
        INSERT INTO applications (
          id, job_id, contractor_id, cover_letter,
          proposed_rate, estimated_duration, availability,
          status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
      `, [
        applicationId,
        body.jobId,
        body.contractorId,
        body.coverLetter,
        body.proposedRate,
        body.estimatedDuration,
        body.availability
      ]);

      // Send notification to job poster
      await sendNotification(
        jobs[0].posted_by,
        'New Job Application',
        'Someone has applied to your job posting'
      );
    });

    const [newApplication] = await query(
      'SELECT * FROM applications WHERE id = ?',
      [applicationId]
    );

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Error creating application' },
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

    if (jobId) {
      conditions.push('a.job_id = ?');
      params.push(jobId);
    }
    if (contractorId) {
      conditions.push('a.contractor_id = ?');
      params.push(contractorId);
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    const applications = await query(`
      SELECT 
        a.*,
        j.title as job_title,
        j.description as job_description,
        j.budget as job_budget,
        j.location as job_location,
        j.status as job_status,
        u.name as contractor_name,
        u2.name as job_poster_name
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN users u ON a.contractor_id = u.id
      LEFT JOIN users u2 ON j.posted_by = u2.id
      ${whereClause}
      ORDER BY a.created_at DESC
    `, params);

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Error fetching applications' },
      { status: 500 }
    );
  }
}