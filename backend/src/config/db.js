import mongoose from 'mongoose';
import dns from 'node:dns';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Ensure .env is loaded regardless of working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // Also check current working directory

// Configure Cloudflare (1.1.1.1, 1.0.0.1) and Google Public DNS (8.8.8.8, 8.8.4.4)
// Essential for resolving MongoDB Atlas SRV records
const configureDNS = () => {
  try {
    const customDns = process.env.DNS_SERVERS
      ? process.env.DNS_SERVERS.split(',').map((s) => s.trim())
      : ['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4'];

    dns.setServers(customDns);
    console.log(`🌐 [DNS] Resolving via Cloudflare & Google DNS: [${customDns.join(', ')}]`);
  } catch (err) {
    console.warn(`⚠️ [DNS Warning] Custom DNS error: ${err.message}`);
  }
};

configureDNS();

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ [Database Error] MONGODB_URI is not set in backend/.env!');
    console.error('👉 Please provide your MongoDB Atlas connection string in backend/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ [Database] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [Database Error] Could not connect to MongoDB Atlas at ${mongoUri}`);
    console.error(`👉 Details: ${error.message}`);
    console.warn(`💡 Tip: Verify your database user credentials and Network Access IP whitelist in MongoDB Atlas.`);

    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DB_OFFLINE) {
      process.exit(1);
    }
  }
};

mongoose.connection.on('connected', () => {
  console.log('✅ [Database] MongoDB Atlas connection established.');
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ [Database] MongoDB Atlas disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ [Database Error] ${err.message}`);
});

export default connectDB;
