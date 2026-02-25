import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://mathdevassuncao_db_user:senha123@artemisdb.4eq9rle.mongodb.net/?appName=artemisDB";
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Apenas POST é permitido' });
    }

    try {
        await client.connect();
        const database = client.db('kanban_db');
        const collection = database.collection('board_state');

        const state = req.body;

        // Atualiza o documento ou cria um novo se não existir (upsert)
        await collection.updateOne(
            { _id: 'global_board' },
            { $set: { state, updatedAt: new Date() } },
            { upsert: true }
        );

        res.status(200).json({ message: 'Salvo com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
}