import { promises as fs } from 'fs';
import path from 'path';
import pool from '@/lib/mysql';

async function migrate() {
  try {
    // Read all SQL files from migrations directory
    const migrationsDir = path.join(process.cwd(), 'lib/db/migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    // Execute each migration file
    for (const file of sqlFiles) {
      console.log(`Executing migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');

      // Split the file into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Execute each statement
      for (const statement of statements) {
        await pool.execute(statement);
      }
    }

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  migrate().catch(console.error);
}

export default migrate;