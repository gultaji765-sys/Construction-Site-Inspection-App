import {open, NitroSQLiteConnection} from 'react-native-nitro-sqlite';

let db: NitroSQLiteConnection | null = null;
let dbInitialization: Promise<NitroSQLiteConnection> | null = null;

export const initializeDatabase = async (): Promise<NitroSQLiteConnection> => {
  const connection = open({
    name: 'construction_inspection.db',
  });

  const createTable = `
    CREATE TABLE IF NOT EXISTS studentData(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone INTEGER,
      class INTEGER,
      address TEXT
    );
  `;

  try {
    await connection.executeAsync(createTable);

    console.log('Database initialized');

    return connection;
  } catch (error) {
    throw new Error('Db Initialization failed: ' + error);
  }
};

export const getDb = async (): Promise<NitroSQLiteConnection> => {
  // We already have a connection
  if (db) {
    return db;
  }

  // Initialization is already in progress
  if (dbInitialization) {
    return dbInitialization;
  }

  // Start initialization and remember the Promise
  dbInitialization = initializeDatabase();

  try {
    db = await dbInitialization;
    return db;
  } finally {
    dbInitialization = null;
  }
};