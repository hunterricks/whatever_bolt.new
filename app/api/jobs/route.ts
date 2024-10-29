import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/mysql';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jobId = uuidv4();
    
    console.log('Creating new job:', {
      jobId,
      postedBy: body.postedBy,
      title: body.title,
      category: body.category
    });
    
    // Verify user exists first
    const userExists = await query(
      'SELECT id FROM users WHERE id = ?',
      [body.postedBy]
    );
    
    if (!userExists.length) {
      console.error('User not found:', body.postedBy);
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Continue with job creation if user exists
    await transaction(async (connection) => {
      // Insert the job with explicit status and payment_status in params
      await connection.execute(`
        INSERT INTO jobs (
          id, title, description, category, location, budget,
          min_hourly_rate, max_hourly_rate, estimated_hours,
          budget_type, scope, duration, experience_level,
          status, payment_status, posted_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        jobId,
        body.title,
        body.description,
        body.category,
        body.location,
        body.budgetType === 'fixed' ? body.budget : null,
        body.budgetType === 'hourly' ? body.minHourlyRate : null,
        body.budgetType === 'hourly' ? body.maxHourlyRate : null,
        body.budgetType === 'hourly' ? body.estimatedHours : null,
        body.budgetType,
        body.scope,
        body.duration,
        body.experienceLevel,
        'open',              // Explicitly include status
        'pending',          // Explicitly include payment_status
        body.postedBy
      ]);

      // Insert skills if provided
      if (body.skills?.length > 0) {
        const skillValues = body.skills.map((skill: string) => [jobId, skill]);
        await connection.query(
          'INSERT INTO job_skills (job_id, skill) VALUES ?',
          [skillValues]
        );
      }
    });

    console.log('Job created successfully:', jobId);
    return NextResponse.json({ 
      success: true, 
      jobId,
      message: 'Job created successfully' 
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Error creating job' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');

    // Basic validation
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let query_string = `
      SELECT 
        j.*,
        u.name as poster_name
      FROM jobs j
      LEFT JOIN users u ON j.posted_by = u.id
    `;

    const params: any[] = [];

    // Filter based on user role
    if (userRole === 'homeowner') {
      query_string += ' WHERE j.posted_by = ?';
      params.push(userId);
    } else if (userRole === 'contractor') {
      query_string += ' WHERE j.status = "open" AND j.posted_by != ?';
      params.push(userId);
    }

    query_string += ' ORDER BY j.created_at DESC';

    console.log('Executing query:', query_string, 'with params:', params); // Debug log

    const jobs = await query(query_string, params);

    console.log('Found jobs:', jobs); // Debug log

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { error: 'Error fetching jobs' },
      { status: 500 }
    );
  }
}
