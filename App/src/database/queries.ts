import { getDb } from "./database"

export async function getDatabase(){
    try {
        const db = await getDb();
        const  result  = await db.executeAsync(`
        SELECT * FROM studentData`);
        console.log("Database: ",result);
    }catch(error){
        console.log("Error: ", error);
    }
    
};
export async function insertInto(){
    try{
        const db = await getDb();
        db.executeAsync(`
            INSERT INTO studentData (id, name, phone, class, address) 
            VALUES(?, ?, ?, ?, ?)`,
            [3, 'Alex', '91389352', 10, 'Lost Angeles'],
        );
    }catch(error){
        throw new Error('Failed to insert '+ error);
    }
}

export async function updateData(){
    try{
        const db = await getDb();
        const result = await db.executeAsync(`
            UPDATE studentData SET name=?, phone=?, class=?, address=?
            WHERE id=?`,
            ['Dalia', '603452056', 11, 'California', 3],
        )
    }catch(error){
        throw new Error('Failed to update '+ error)
    }
}

export async function deleteData(){
    try{
        const db = await getDb();
        await db.executeAsync(`
            DELETE FROM studentData WHERE id=?`,
            [3],
        )
    }catch(error){
        throw new Error('Failed to Delete '+ error);
    }
}
