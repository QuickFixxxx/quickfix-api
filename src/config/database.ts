import * as schema from "../core/models/index";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { environmentVar } from "./env";

class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private pool!: Pool;
  private db: ReturnType<typeof drizzle<typeof schema>> | null = null;

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    if (!environmentVar.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in the environment.");
    }

    this.pool = new Pool({
      connectionString: environmentVar.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 60000 * 5,
      connectionTimeoutMillis: 5000,
    });

    DatabaseConnection.instance = this;
  }

  getConnection() {
    console.log(environmentVar.DATABASE_URL);
    if (!this.db) {
      this.db = drizzle(this.pool, { schema });
    }

    return this.db;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log("Database pool closed.");
    }
  }
}

const dbInstance = new DatabaseConnection();
export const db = dbInstance.getConnection();
