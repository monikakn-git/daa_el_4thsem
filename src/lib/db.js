import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const dataDir = join(process.cwd(), "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, "app.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    receivedAt TEXT
  );
`);

export function saveContact(contact) {
  const stmt = db.prepare(`
    INSERT INTO contacts (id, name, email, subject, message, receivedAt)
    VALUES (@id, @name, @email, @subject, @message, @receivedAt)
  `);
  stmt.run(contact);
  return contact;
}

export function getContacts() {
  const stmt = db.prepare(`SELECT * FROM contacts ORDER BY receivedAt DESC`);
  return stmt.all();
}
