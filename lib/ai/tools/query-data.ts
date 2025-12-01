import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Load schema and documentation once at startup
const schema = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'schema.json'), 'utf-8'));
const documentation = fs.readFileSync(path.join(process.cwd(), 'documentation.txt'), 'utf-8');

// Initialize database connection
const db = new Database(path.join(process.cwd(), 'data.db'));

interface QueryDataParams {
  sql: string;
  explanation?: string;
}

export async function queryData({ sql, explanation }: QueryDataParams) {
  try {
    // Execute the query
    const results = db.prepare(sql).all() as Record<string, unknown>[];
    
    // Format results for display
    const formattedResults = {
      query: sql,
      explanation: explanation || 'No explanation provided',
      rowCount: results.length,
      results: results.slice(0, 100), // Limit to first 100 rows for display
      truncated: results.length > 100,
      columns: results.length > 0 ? Object.keys(results[0] as object) : []
    };

    return formattedResults;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Query failed: ${error.message}`);
    }
    throw new Error('Query failed: Unknown error');
  }
}

// Helper to get schema and documentation for system prompt
export function getContext() {
  return {
    schema,
    documentation
  };
}

// Clean up database connection on process exit
process.on('exit', () => {
  db.close();
});
