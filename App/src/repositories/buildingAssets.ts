import { open, NitroSQLiteConnection } from 'react-native-nitro-sqlite';
import { Asset } from '../models/Asset';

let db: NitroSQLiteConnection | null = null;
let dbInitialization: Promise<NitroSQLiteConnection> | null = null;

export const initializeDatabase = async (): Promise<NitroSQLiteConnection> => {
  const connection = open({
    name: 'construction_inspection.db',
  });

  const createTable = `
    CREATE TABLE IF NOT EXISTS BuildingAssets(
        asset_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        building_name TEXT, 
        building_code TEXT,
        floor_number INTEGER, 
        zone TEXT, 
        gps_latitude REAL,
        gps_longitude REAL,
        construction_stage TEXT, 
        inspection_status TEXT,
        notes TEXT,
        is_deleted INTEGER, 
        created_at TEXT,
        updated_at TEXT
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

export const getDb = async ()=> {
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


export async function getAssets(): Promise<Asset[]>{
    try {
        const db = await getDb();
        const {rows}   = await db.executeAsync(`
        SELECT * FROM BuildingAssets`);
        return rows._array.map(row => ({
            asset_id: Number(row.asset_id),
            project_id: Number(row.project_id),
            building_name: String(row.building_name),
            building_code: String(row.building_code),
            floor_number: Number(row.floor_number),
            zone: String(row.zone),
            gps_latitude: Number(row.gps_latitude),
            gps_longitude: Number(row.gps_longitude),
            construction_stage: String(row.construction_stage),
            inspection_status: String(row.inspection_status),
            notes: String(row.notes),
            is_deleted: Number(row.is_deleted),
            created_at: String(row.created_at),
            updated_at: String(row.updated_at),
        })
    );
    }catch(error){
        throw new Error("Fetching failed " + error);
    }
    
};

export async function getAssetById(asset_id : number) : Promise<Asset | null>{
    try{
        const db = await getDb();
        const {rows} = await db.executeAsync(`
            SELECT * FROM BuildingAssets WHERE asset_id=? LIMIT 1`,
            [asset_id]
        );
        if(rows.length === 0) return null;
        const row = rows._array[0];
        return {
            asset_id: Number(row.asset_id),
            project_id: Number(row.project_id),
            building_name: String(row.building_name),
            building_code: String(row.building_code),
            floor_number: Number(row.floor_number),
            zone: String(row.zone),
            gps_latitude: Number(row.gps_latitude),
            gps_longitude: Number(row.gps_longitude),
            construction_stage: String(row.construction_stage),
            inspection_status: String(row.inspection_status),
            notes: String(row.notes),
            is_deleted: Number(row.is_deleted),
            created_at: String(row.created_at),
            updated_at: String(row.updated_at),
        };
    }catch(error){
        const message = error instanceof Error ? error.message : String(error);
        throw new Error('Fetching failed: ' + message);
    }
}
export async function createAsset(
    project_id: number,
    building_name: string,
    building_code: string,
    floor_number: number,
    zone: string,
    gps_latitude: number,
    gps_longitude: number,
    construction_stage: string,
    inspection_status: string,
    notes: string,
    is_deleted: number,
    created_at: string,
    updated_at: string,
){
    try{
        const db = await getDb();
        await db.executeAsync(`
            INSERT INTO BuildingAssets (
            project_id, building_name, building_code,
            floor_number, zone, gps_latitude,
            gps_longitude, construction_stage, inspection_status,
            notes, is_deleted, created_at, updated_at) 
            VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [project_id, building_name, building_code,
            floor_number, zone, gps_latitude,
            gps_longitude, construction_stage, inspection_status,
            notes, is_deleted, created_at, updated_at],
        );
    }catch(error){
        throw new Error('Failed to insert '+ error);
    }
}

export async function updateAsset(
  asset_id: number,
  project_id: number,
  building_name: string,
  building_code: string,
  floor_number: number,
  zone: string,
  gps_latitude: number,
  gps_longitude: number,
  construction_stage: string,
  inspection_status: string,
  notes: string,
  updated_at: string,
) {
  try {
    const db = await getDb();

    await db.executeAsync(`
      UPDATE BuildingAssets
      SET
        project_id=?,
        building_name=?,
        building_code=?,
        floor_number=?,
        zone=?,
        gps_latitude=?,
        gps_longitude=?,
        construction_stage=?,
        inspection_status=?,
        notes=?,
        updated_at=?
      WHERE asset_id=?`,
      [
        project_id,
        building_name,
        building_code,
        floor_number,
        zone,
        gps_latitude,
        gps_longitude,
        construction_stage,
        inspection_status,
        notes,
        updated_at,
        asset_id,
      ],
    );
  } catch (error) {
    throw new Error('Failed to update ' + error);
  }
}

export async function deleteAsset(asset_id : number){
    try{
        const db = await getDb();
        await db.executeAsync(`
            UPDATE BuildingAssets
            SET is_deleted=1 
            WHERE asset_id=?`,
            [asset_id],
        )
    }catch(error){
        throw new Error('Failed to Delete '+ error);
    }
}

