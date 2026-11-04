import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../backend/.env") });

const mongoUri = process.env.MONGO_URI;
console.log("Connecting to MongoDB...");

await mongoose.connect(mongoUri, { dbName: "test" });
console.log("Connected successfully to DB:", mongoose.connection.name);

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model("User", userSchema, "users");

const sessionSchema = new mongoose.Schema({}, { strict: false });
const WorkSession = mongoose.model("WorkSession", sessionSchema, "worksessions");

// Find users matching rajesh or rejesh
const users = await User.find({
  $or: [
    { name: { $regex: /rajesh|rejesh/i } },
    { email: { $regex: /rajesh|rejesh/i } },
    { username: { $regex: /rajesh|rejesh/i } }
  ]
}).lean();

console.log("\n--- Matching Users found ---");
console.log(users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, company: u.company })));

if (users.length === 0) {
  // Let's list all users to see the actual names in the DB
  const allUsers = await User.find({}, { name: 1, email: 1, role: 1 }).lean();
  console.log("All users in DB:", allUsers);
}

const userIds = users.map(u => u._id);

// Find sessions for these users in the last 3 days
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
const sessions = await WorkSession.find({
  userId: { $in: userIds },
  createdAt: { $gte: threeDaysAgo }
}).sort({ createdAt: -1 }).lean();

console.log(`\n--- WorkSessions found (${sessions.length}) ---`);
for (const s of sessions) {
  console.log({
    id: s._id,
    date: s.date,
    status: s.status,
    startTime: s.startTime,
    stopTime: s.stopTime,
    totalMinutes: s.totalMinutes,
    pausedMinutes: s.pausedMinutes,
    lastHeartbeat: s.lastHeartbeat,
    pausesCount: s.pauses?.length || 0,
    pauses: s.pauses,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    systemRemarks: s.systemRemarks
  });
}

// Also check all sessions created today across ALL users just in case name is slightly different
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
const todaySessions = await WorkSession.find({
  createdAt: { $gte: todayStart }
}).sort({ createdAt: -1 }).lean();

console.log(`\n--- ALL Users Sessions Today (${todaySessions.length}) ---`);
for (const ts of todaySessions) {
  const u = await User.findById(ts.userId, { name: 1, email: 1 }).lean();
  console.log({
    userName: u?.name || "Unknown",
    userId: ts.userId,
    status: ts.status,
    startTime: ts.startTime,
    stopTime: ts.stopTime,
    totalMinutes: ts.totalMinutes,
    pausedMinutes: ts.pausedMinutes,
    lastHeartbeat: ts.lastHeartbeat,
    pauses: ts.pauses?.length
  });
}

await mongoose.disconnect();
console.log("\nDisconnected from DB.");

