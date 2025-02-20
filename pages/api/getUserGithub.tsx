import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username } = req.query

    const apiUrl = process.env.NEXT_PUBLIC_BASE_GITHUB_URL;

    if (!apiUrl) {
        return res.status(500).json({ error: 'Missing API configuration' });
    }

    try {
        const response = await fetch(`${apiUrl}/users/${username}`, { method: 'GET' });

        const data = await response.json();

        console.log('response', data)

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}
