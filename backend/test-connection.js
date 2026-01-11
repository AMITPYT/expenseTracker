import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB connection...\n');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully!');
        console.log('📍 Database:', mongoose.connection.name);
        mongoose.connection.close();
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ MongoDB connection failed!');
        console.error('Error:', error.message);
        console.log('\n💡 Common issues:');
        console.log('   - MongoDB service is not running');
        console.log('   - Invalid connection string');
        console.log('   - Network/firewall issues');
        console.log('   - Authentication credentials incorrect');
        process.exit(1);
    });

// Timeout after 10 seconds
setTimeout(() => {
    console.error('\n❌ Connection timeout - taking too long to connect');
    process.exit(1);
}, 10000);
