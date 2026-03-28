import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import application_routes from './routes/dominos_route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env_path = '../../../../environs/development/.env';
dotenv.config({ path: path.resolve(__dirname, env_path) });

const app = express();
const PORT = process.env.DOMINOS_PORT || 3003;

const config = {
    origin: [
        'https://downloadmoredpi.com',
        'https://dev.d2m3eh6glowwk4.amplifyapp.com',
        'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}

app.use(cors(config));
app.use(express.json());

app.use('/api/dominos', application_routes);

app.listen(PORT, async () => {
    console.log(`Dominos API Service launched on port ${PORT}`);
});
