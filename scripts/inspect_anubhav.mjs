import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  const db = mongoose.connection.db;
  const users = await db.collection('users').find({ name: /anubhav/i }).toArray();
  console.log('Users found:', users.map(u => ({ id: u._id, name: u.name, email: u.email })));

  if (users.length > 0) {
    const uIds = users.map(u => u._id);
    const sessions = await db.collection('worksessions').find({
      user: { $in: uIds }
    }).sort({ createdAt: -1 }).limit(10).toArray();

    console.log(`Found ${sessions.length} sessions for Anubhav:`);
    for (const s of sessions) {
      console.log('--------------------------------------------------');
      console.log('ID:', s._id);
      console.log('Date:', s.date);
      console.log('Status:', s.status);
      console.log('TotalMinutes:', s.totalMinutes, `(~${((s.totalMinutes || 0)/60).toFixed(2)} hours)`);
      console.log('AccumulatedMinutes:', s.accumulatedMinutes);
      console.log('CreatedAt:', s.createdAt);
      console.log('UpdatedAt:', s.updatedAt);
      console.log('CurrentStart:', s.currentStart);
      console.log('PausedAt:', s.pausedAt);
      console.log('Segments count:', s.segments?.length);
      if (s.segments?.length) {
        s.segments.forEach((seg, i) => {
          const start = new Date(seg.start);
          const end = seg.end ? new Date(seg.end) : null;
          const diffMin = end ? ((end - start) / 60000).toFixed(1) : 'active';
          console.log(`  Seg ${i+1}: ${seg.start} -> ${seg.end || 'ongoing'} [${diffMin} mins]`);
        });
      }
    }
  } else {
    // List all users to see actual names
    const allUsers = await db.collection('users').find({}).limit(20).toArray();
    console.log('All users in DB:', allUsers.map(u => u.name));
  }

  await mongoose.disconnect();
}

main().catch(console.error);

