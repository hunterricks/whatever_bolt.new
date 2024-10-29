import mysql from 'mysql2/promise';

// Create connection pool with optimized settings
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // Connection settings
  connectTimeout: 60000, // Increased timeout to 60 seconds
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  
  // SSL settings for production
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true
  } : undefined,
  
  // Performance settings
  namedPlaceholders: true,
  dateStrings: true,
});

// Test and initialize the connection
async function initializeDatabase() {
  let connection;
  let retries = 5;
  let delay = 2000; // Increased initial delay to 2 seconds

  while (retries > 0) {
    try {
      connection = await pool.getConnection();
      console.log('Successfully connected to MySQL database');
      
      // Initialize schema
      await initializeSchema();
      return;
    } catch (err) {
      console.error(`Error connecting to MySQL database (${retries} retries left):`, err);
      retries--;
      
      // In webcontainer mode, don't throw error if connection fails
      if (process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer') {
        console.log('Running in webcontainer mode - continuing without MySQL connection');
        return;
      }

      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  throw new Error('Failed to connect to database after multiple retries');
}

export async function query<T>(
  sql: string,
  params?: (string | number | boolean | null)[]
): Promise<T> {
  // In webcontainer mode, return mock data
  if (process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer') {
    return [] as any;
  }

  const retries = 3;
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows as T;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.code === 'ER_DUP_ENTRY' || error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  console.error('Database query error after retries:', lastError);
  throw lastError;
}

export async function transaction<T>(
  callback: (connection: mysql.Connection) => Promise<T>
): Promise<T> {
  // In webcontainer mode, just execute the callback
  if (process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer') {
    return callback(null as any);
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Initialize database schema
async function initializeSchema() {
  try {
    // Create users table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    // Create jobs table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        location VARCHAR(255) NOT NULL,
        budget DECIMAL(10, 2),
        min_hourly_rate DECIMAL(10, 2),
        max_hourly_rate DECIMAL(10, 2),
        estimated_hours INT,
        budget_type ENUM('fixed', 'hourly') NOT NULL,
        scope ENUM('small', 'medium', 'large') NOT NULL,
        duration VARCHAR(20) NOT NULL,
        experience_level ENUM('entry', 'intermediate', 'expert') NOT NULL,
        status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
        payment_status ENUM('pending', 'escrow', 'released', 'refunded') DEFAULT 'pending',
        posted_by VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (posted_by) REFERENCES users(id),
        INDEX idx_status (status),
        INDEX idx_category (category),
        INDEX idx_posted_by (posted_by)
      )
    `);

    // Create job_skills table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS job_skills (
        job_id VARCHAR(36),
        skill VARCHAR(50),
        PRIMARY KEY (job_id, skill),
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        INDEX idx_skill (skill)
      )
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    if (process.env.NEXT_PUBLIC_ENV_MODE !== 'webcontainer') {
      throw error;
    }
  }
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    if (process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer') {
      return true;
    }
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Initialize on startup if not in test environment
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch(console.error);
}

export default pool;