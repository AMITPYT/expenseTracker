import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Checking environment configuration...\n');

const envPath = join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found at:', envPath);
    console.log('\n📝 Please create a .env file with the following content:');
    console.log('MONGODB_URI=your_mongodb_connection_string');
    console.log('JWT_SECRET=your_jwt_secret_key');
    console.log('PORT=5000');
    process.exit(1);
}

console.log('✅ .env file exists');

// Load environment variables
dotenv.config();

// Check required variables
const required = ['MONGODB_URI', 'JWT_SECRET'];
let allPresent = true;

required.forEach(key => {
    if (process.env[key]) {
        console.log(`✅ ${key} is set`);
        if (key === 'MONGODB_URI') {
            // Mask the URI for security
            const uri = process.env[key];
            const masked = uri.includes('@')
                ? uri.substring(0, uri.indexOf('@') + 1) + '***'
                : uri.substring(0, 20) + '***';
            console.log(`   Value: ${masked}`);
        }
    } else {
        console.log(`❌ ${key} is NOT set`);
        allPresent = false;
    }
});

console.log(`\n✅ PORT: ${process.env.PORT || 5000} (default)`);

if (!allPresent) {
    console.log('\n❌ Some required environment variables are missing!');
    process.exit(1);
} else {
    console.log('\n✅ All required environment variables are set!');
}
