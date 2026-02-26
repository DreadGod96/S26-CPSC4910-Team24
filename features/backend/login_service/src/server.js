import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env_path = '../../../../environs/development/.env';
dotenv.config({ path: path.resolve(__dirname, env_path) });

console.log(`Connecting to host: ${process.env.DB_HOST}`);


const app = express();
const PORT = process.env.LOGIN_PORT || 3003;

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

const { default: login_routes } = (await import('./routes/login_routes.js'));
app.use('/api', login_routes);


const { test_connection } = await import('../../../../shared/lib/db.js');

app.listen(PORT, async () => {
    console.log(`Login Service launched on port ${PORT}`);

    try {
        await test_connection();
    } catch (error) {
        console.error("Server started, but DB is unreachable.");
    }
});
