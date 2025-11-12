// This file must be imported FIRST before any other modules that use environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the backend directory (two levels up from src/config)
dotenv.config({ path: join(__dirname, '../../.env') });

// Re-export to ensure this module is evaluated
export {};

