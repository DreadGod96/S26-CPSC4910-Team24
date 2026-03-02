import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env_path = '../../../../environs/development/.env';
dotenv.config({ path: path.resolve(__dirname, env_path) });

const app = express();
const PORT = process.env.POINTS_PORT || 3003;

const config = {
    origin: [
        'https://dev.d2m3eh6glowwk4.amplifyapp.com',
        'https://downloadmoredpi.com',
        'http://localhost:3000'
    ],
    methods: ['GET', 'OPTIONS'],
    credentials: true
};

app.use(cors(config));
app.use(express.json());

const { default: points_routes } = await import('./routes/points_routes.js');
app.use('/api/points', points_routes);

const { test_connection } = await import('../../../../shared/lib/db.js');

app.listen(PORT, async () => {
    console.log(`Points Service launched on port ${PORT}`);
    try {
        await test_connection();
    } catch (error) {
        console.error("Server started, but DB is unreachable.");
    }
});