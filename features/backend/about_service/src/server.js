import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//unless the .env is production use the dev .env path
const env_path = process.env.NODE_ENV === 'production' ? '../../../../environs/production/.env' : '../../../../environs/development/.env';
dotenv.config({ path: path.resolve(__dirname, env_path) });

console.log(`Loading .env from: ${path.resolve(__dirname, env_path)}`);
console.log(`Connecting to host: ${process.env.DB_HOST}`);


const app = express();
const PORT = process.env.ABOUT_PORT || 3001;

//Only call GETs
const config = {
    origin: ['https://dev.d2m3eh6glowwk4.amplifyapp.com/',
	    'https://downloadmoredpi.com/',
	    'https://downloadmoredpi.com',
             'https://dev.d2m3eh6glowwk4.amplifyapp.com',
             'http://localhost:3000'
             ],
    methods: ['GET', 'OPTIONS'],
    credentials: true
}

app.use(cors(config));
app.use(express.json());

const { default: about_routes } = (await import('./routes/about_routes.js'));
app.use('/api/about', about_routes);


const { test_connection } = await import('../../../../shared/lib/db.js');

app.listen(PORT, async () => {
    console.log(`About Service launched on port ${PORT}`);

    try {
        await test_connection();
    } catch (error) {
        console.error("Server started, but DB is unreachable.");
    }
});
