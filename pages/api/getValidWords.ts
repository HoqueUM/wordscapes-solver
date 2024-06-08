import { getValidWords } from "../../utils/unscrambler";

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const { letters, length } = req.body;

        if (!letters || !length) {
            res.status(400).json({ error: 'Missing letters or length parameter' });
            return;
        }

        try {
            const validWords = await getValidWords(letters, length);
            res.status(200).json({ validWords });
        } catch (error) {
            res.status(500).json({ error: 'Error processing the request' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}