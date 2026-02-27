import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env_path = '../../../../environs/development/.env';
dotenv.config({ path: path.resolve(__dirname, env_path) });

console.log(`Connecting to host: ${process.env.DB_HOST}`);


const app = express();
const PORT = process.env.APPLICATION_PORT || 3003;

const config = {
    origin: ['https://dev.d2m3eh6glowwk4.amplifyapp.com/',
	    'https://downloadmoredpi.com/',
	    'https://downloadmoredpi.com',
             'https://dev.d2m3eh6glowwk4.amplifyapp.com',
             'http://localhost:3000'
             ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}

app.use(cors(config));
app.use(express.json());

const { default: application_routes } = (await import('./routes/dominos_routes.js'));
app.use('/api/dominos', application_routes);

app.listen(PORT, async () => {
    console.log(`Dominos API Service launched on port ${PORT}`);
});
