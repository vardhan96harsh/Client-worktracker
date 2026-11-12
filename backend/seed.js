import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Category from "./models/Category.js";

dotenv.config();

const MONGO = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/projecttrack";

async function run() {
  await mongoose.connect(MONGO);
  console.log("Mongo connected to:", MONGO.replace(/:[^:]*@/, ":****@"));

  const defaultPassword = "Pass@123";
  const defaultHash = await bcrypt.hash(defaultPassword, 10);

  // 1. Ensure Super Admin Account
  const superAdminEmail = "superadmin@demo.com";
  let superAdmin = await User.findOne({ email: superAdminEmail });
  if (!superAdmin) {
    superAdmin = await User.create({
      name: "Super Admin",
      email: superAdminEmail,
      employeeId: "EMP-001",
      passwordHash: defaultHash,
      role: "superadmin",
      status: "active",
      personalDetails: {
        phone: "+91 98765 43210",
        alternateEmail: "superadmin.backup@demo.com",
        emergencyContact: {
          name: "Main HQ",
          relation: "Organization",
          phone: "+91 98765 00000"
        },
        currentAddress: "Executive Suite 1, Alogic Tech Park",
        permanentAddress: "Executive Suite 1, Alogic Tech Park",
        panNumber: "ABCDE1234F",
        nationalId: "1234-5678-9012",
        bankDetails: {
          accountNumber: "998877665544",
          ifscCode: "HDFC0001234",
          bankName: "HDFC Bank"
        }
      }
    });
    console.log("✅ Super Admin created:", superAdminEmail, "| Password:", defaultPassword);
  } else {
    superAdmin.role = "superadmin";
    superAdmin.passwordHash = defaultHash;
    superAdmin.status = "active";
    if (!superAdmin.employeeId) superAdmin.employeeId = "EMP-001";
    await superAdmin.save();
    console.log("✅ Super Admin updated with password", defaultPassword, ":", superAdminEmail);
  }

  // 2. Ensure Regular Admin Account
  const adminEmail = "admin@demo.com";
  let adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      employeeId: "EMP-002",
      passwordHash: defaultHash,
      role: "admin",
      status: "active"
    });
    console.log("✅ Admin created:", adminEmail, "| Password:", defaultPassword);
  } else {
    adminExists.role = "admin";
    adminExists.passwordHash = defaultHash;
    adminExists.status = "active";
    if (!adminExists.employeeId) adminExists.employeeId = "EMP-002";
    await adminExists.save();
    console.log("✅ Admin updated with password", defaultPassword, ":", adminEmail);
  }

  // 3. Ensure default categories
  const defaults = ["eLearning", "Video", "PDF"];
  for (const name of defaults) {
    const c = await Category.findOne({ name });
    if (!c) {
      await Category.create({ name });
      console.log("Category created:", name);
    }
  }

  await mongoose.disconnect();
  console.log("🎉 Seed finished successfully!");
}

run().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
