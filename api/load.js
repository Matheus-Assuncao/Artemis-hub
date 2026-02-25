import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://mathdevassuncao_db_user:senha123@artemisdb.4eq9rle.mongodb.net/?appName=artemisDB";
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Apenas GET é permitido' });
    }

    try {
        await client.connect();
        const database = client.db('kanban_db');
        const collection = database.collection('board_state');

        const data = await collection.findOne({ _id: 'global_board' });

        res.status(200).json(data ? data.state : {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
}