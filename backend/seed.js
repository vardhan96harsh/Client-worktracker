// backend/seed.js
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly resolve .env in the backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

import User from "./models/User.js";
import Category from "./models/Category.js";
import Company from "./models/Company.js";
import Project from "./models/Project.js";
import ProjectPlan from "./models/ProjectPlan.js";
import Task from "./models/Task.js";
import Holiday from "./models/Holiday.js";
import WorkSession from "./models/WorkSession.js";
import Timesheet from "./models/Timesheet.js";

const MONGO = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/projecttrack";

async function run() {
  await mongoose.connect(MONGO);
  console.log("Connected to MongoDB:", MONGO.replace(/:[^:]*@/, ":****@"));

  const defaultPassword = "Pass@123";
  const defaultHash = await bcrypt.hash(defaultPassword, 10);

  // ==========================================
  // 1. SEED CATEGORIES
  // ==========================================
  console.log("\n📁 Seeding Categories...");
  const categoryNames = [
    "eLearning",
    "Video",
    "PDF",
    "Microlearning",
    "Simulation & VR"
  ];

  const categoryMap = {};
  for (const name of categoryNames) {
    let cat = await Category.findOne({ name });
    if (!cat) {
      cat = await Category.create({ name });
      console.log(`  ➕ Category created: ${name}`);
    } else {
      console.log(`  ✓ Category exists: ${name}`);
    }
    categoryMap[name] = cat;
  }

  // ==========================================
  // 2. SEED COMPANIES
  // ==========================================
  console.log("\n🏢 Seeding Companies...");
  const companyNames = [
    "Acme Global Learning",
    "Apex Pharma Technologies",
    "NextGen Financial Solutions",
    "CyberCore Interactive",
    "BlueSky Retail Corp"
  ];

  const companyMap = {};
  for (const name of companyNames) {
    let comp = await Company.findOne({ name });
    if (!comp) {
      comp = await Company.create({ name });
      console.log(`  ➕ Company created: ${name}`);
    } else {
      console.log(`  ✓ Company exists: ${name}`);
    }
    companyMap[name] = comp;
  }

  // ==========================================
  // 3. SEED USERS WITH RICH PROFILES
  // ==========================================
  console.log("\n👥 Seeding Users with Complete Profiles...");
  const usersToSeed = [
    {
      name: "Super Admin",
      email: "superadmin@demo.com",
      employeeId: "EMP-001",
      role: "superadmin",
      designation: "Manager",
      gender: "Male",
      dob: new Date("1988-04-12"),
      joiningDate: new Date("2021-01-10"),
      phone: "+91 98765 43210",
      salary: "150000",
      lastSalary: "135000",
      bankName: "HDFC Bank",
      accountNumber: "50100234567890",
      ifsc: "HDFC0001234",
      city: "Mumbai"
    },
    {
      name: "Admin",
      email: "admin@demo.com",
      employeeId: "EMP-002",
      role: "admin",
      designation: "Manager",
      gender: "Male",
      dob: new Date("1990-08-25"),
      joiningDate: new Date("2022-03-15"),
      phone: "+91 98765 11223",
      salary: "120000",
      lastSalary: "105000",
      bankName: "ICICI Bank",
      accountNumber: "001234567890",
      ifsc: "ICIC0000012",
      city: "Pune"
    },
    {
      name: "Sarah Jenkins",
      email: "sarah.jenkins@demo.com",
      employeeId: "EMP-101",
      role: "employee",
      designation: "Manager",
      gender: "Female",
      dob: new Date("1991-05-18"),
      joiningDate: new Date("2022-06-01"),
      phone: "+91 98765 22334",
      salary: "95000",
      lastSalary: "85000",
      bankName: "Axis Bank",
      accountNumber: "9180100456789",
      ifsc: "UTIB0000123",
      city: "Bengaluru"
    },
    {
      name: "Priya Patel",
      email: "priya.patel@demo.com",
      employeeId: "EMP-102",
      role: "employee",
      designation: "Instructional Designer",
      gender: "Female",
      dob: new Date("1994-09-14"),
      joiningDate: new Date("2023-02-10"),
      phone: "+91 98765 33445",
      salary: "75000",
      lastSalary: "65000",
      bankName: "State Bank of India",
      accountNumber: "20145678901",
      ifsc: "SBIN0001456",
      city: "Ahmedabad"
    },
    {
      name: "Alex Miller",
      email: "alex.miller@demo.com",
      employeeId: "EMP-103",
      role: "employee",
      designation: "Instructional Designer",
      gender: "Male",
      dob: new Date("1993-11-20"),
      joiningDate: new Date("2023-04-15"),
      phone: "+91 98765 44556",
      salary: "72000",
      lastSalary: "64000",
      bankName: "HDFC Bank",
      accountNumber: "50100987654321",
      ifsc: "HDFC0001234",
      city: "Hyderabad"
    },
    {
      name: "Vikram Singh",
      email: "vikram.singh@demo.com",
      employeeId: "EMP-104",
      role: "employee",
      designation: "Storyline Developer",
      gender: "Male",
      dob: new Date("1992-02-28"),
      joiningDate: new Date("2022-09-01"),
      phone: "+91 98765 55667",
      salary: "82000",
      lastSalary: "72000",
      bankName: "Kotak Mahindra Bank",
      accountNumber: "123456789012",
      ifsc: "KKBK0000123",
      city: "Delhi"
    },
    {
      name: "David Chen",
      email: "david.chen@demo.com",
      employeeId: "EMP-105",
      role: "employee",
      designation: "Software Developer",
      gender: "Male",
      dob: new Date("1995-07-08"),
      joiningDate: new Date("2023-07-15"),
      phone: "+91 98765 66778",
      salary: "85000",
      lastSalary: "75000",
      bankName: "HDFC Bank",
      accountNumber: "50100456123789",
      ifsc: "HDFC0001234",
      city: "Bengaluru"
    },
    {
      name: "Ananya Deshmukh",
      email: "ananya.deshmukh@demo.com",
      employeeId: "EMP-106",
      role: "employee",
      designation: "Graphic Designer",
      gender: "Female",
      dob: new Date("1996-03-30"),
      joiningDate: new Date("2023-08-01"),
      phone: "+91 98765 77889",
      salary: "68000",
      lastSalary: "60000",
      bankName: "ICICI Bank",
      accountNumber: "001234789012",
      ifsc: "ICIC0000012",
      city: "Pune"
    },
    {
      name: "Marcus Rossi",
      email: "marcus.rossi@demo.com",
      employeeId: "EMP-107",
      role: "employee",
      designation: "Animator",
      gender: "Male",
      dob: new Date("1993-12-05"),
      joiningDate: new Date("2023-03-01"),
      phone: "+91 98765 88990",
      salary: "78000",
      lastSalary: "70000",
      bankName: "Axis Bank",
      accountNumber: "9180100987654",
      ifsc: "UTIB0000123",
      city: "Chennai"
    },
    {
      name: "Neha Gupta",
      email: "neha.gupta@demo.com",
      employeeId: "EMP-108",
      role: "employee",
      designation: "Quality Analyst",
      gender: "Female",
      dob: new Date("1995-10-15"),
      joiningDate: new Date("2023-05-10"),
      phone: "+91 98765 99001",
      salary: "65000",
      lastSalary: "58000",
      bankName: "State Bank of India",
      accountNumber: "20145698765",
      ifsc: "SBIN0001456",
      city: "Noida"
    },
    {
      name: "John Doe",
      email: "john.doe@demo.com",
      employeeId: "EMP-109",
      role: "employee",
      designation: "Quality Analyst",
      gender: "Male",
      dob: new Date("1994-01-22"),
      joiningDate: new Date("2023-06-20"),
      phone: "+91 98765 00112",
      salary: "62000",
      lastSalary: "55000",
      bankName: "HDFC Bank",
      accountNumber: "50100789456123",
      ifsc: "HDFC0001234",
      city: "Kolkata"
    }
  ];

  const userMap = {};
  for (const u of usersToSeed) {
    let existing = await User.findOne({ email: u.email });
    const userPayload = {
      name: u.name,
      email: u.email,
      employeeId: u.employeeId,
      passwordHash: defaultHash,
      role: u.role,
      status: "active",
      designation: u.designation,
      gender: u.gender,
      dob: u.dob,
      joiningDate: u.joiningDate,
      personalDetails: {
        phone: u.phone,
        alternateEmail: `${u.email.split("@")[0]}.alt@demo.com`,
        emergencyContact: {
          name: "Family Contact",
          relation: "Spouse/Parent",
          phone: "+91 98000 00000"
        },
        currentAddress: `Suite ${u.employeeId}, Technology Park, ${u.city}`,
        permanentAddress: `Residence, ${u.city}`,
        panNumber: `ABCDE${u.employeeId.replace("EMP-", "")}9F`,
        nationalId: `9876-5432-${u.employeeId.replace("EMP-", "10")}`,
        bankDetails: {
          accountNumber: u.accountNumber,
          ifscCode: u.ifsc,
          bankName: u.bankName
        },
        documents: {
          offerLetter: { isAvailable: true, status: "Available", remarks: "Verified and signed" },
          twoPhotos: { isAvailable: true, status: "Available", remarks: "Passport size received" },
          aadhaarDoc: { number: `9876-5432-${u.employeeId.replace("EMP-", "10")}`, isAvailable: true, status: "Available", remarks: "Verified" },
          panDoc: { number: `ABCDE${u.employeeId.replace("EMP-", "")}9F`, isAvailable: true, status: "Available", remarks: "Verified" },
          previousExperienceDoc: { isAvailable: true, status: "Available", companyName: "TechCorp Global", designation: u.designation, remarks: "Relieving letter verified" },
          originalDoc: { isAvailable: true, status: "Available", docName: "Degree Certificate", remarks: "Original inspected" },
          chequeDoc: { isAvailable: true, status: "Available", bankName: u.bankName, chequeNumber: "100234", remarks: "Cancelled cheque filed" }
        },
        salaryDetails: {
          salaryStartDate: u.joiningDate,
          currentSalary: u.salary,
          lastSalary: u.lastSalary,
          lastIncrementDate: new Date("2026-04-01"),
          incrementDetails: "Annual Performance Appraisal",
          salaryAccount: u.accountNumber,
          remarks: "Confirmed in role",
          increments: [
            {
              incrementDate: new Date("2026-04-01"),
              previousSalary: u.lastSalary,
              newSalary: u.salary,
              hikePercentage: "12%",
              reason: "Annual performance appraisal & milestone achievement",
              remarks: "Approved by Management"
            }
          ]
        }
      }
    };

    if (!existing) {
      existing = await User.create(userPayload);
      console.log(`  ➕ User created: ${u.email} (${u.designation})`);
    } else {
      Object.assign(existing, userPayload);
      await existing.save();
      console.log(`  ✓ User updated: ${u.email} (${u.designation})`);
    }
    userMap[u.email] = existing;
  }

  // ==========================================
  // 4. SEED PROJECTS
  // ==========================================
  console.log("\n📦 Seeding Projects...");
  const projectsToSeed = [
    {
      name: "Compliance & Anti-Harassment 2026",
      companyName: "Acme Global Learning",
      categoryName: "eLearning",
      code: "AGL-EL-101",
      description: "Interactive corporate compliance and ethics course with realistic workplace scenarios.",
      date: "2026-11-01",
      status: "in_progress"
    },
    {
      name: "Executive Leadership Micro-Modules",
      companyName: "Acme Global Learning",
      categoryName: "Microlearning",
      code: "AGL-ML-102",
      description: "Mobile-first 5-minute leadership development modules for frontline supervisors.",
      date: "2026-10-15",
      status: "active"
    },
    {
      name: "Good Manufacturing Practice (GMP) Certification",
      companyName: "Apex Pharma Technologies",
      categoryName: "eLearning",
      code: "APT-GMP-201",
      description: "Mandatory cGMP validation course with audit assessments for cleanroom technicians.",
      date: "2026-11-05",
      status: "active"
    },
    {
      name: "Lab Safety Interactive Walkthrough",
      companyName: "Apex Pharma Technologies",
      categoryName: "Simulation & VR",
      code: "APT-VR-202",
      description: "Interactive 3D chemical spill containment and safety drill simulation.",
      date: "2026-10-20",
      status: "in_progress"
    },
    {
      name: "Anti-Money Laundering (AML) Storyline Course",
      companyName: "NextGen Financial Solutions",
      categoryName: "eLearning",
      code: "NGF-AML-301",
      description: "Branching scenario module simulating suspicious transaction identification and KYC rules.",
      date: "2026-09-15",
      status: "active"
    },
    {
      name: "Wealth Advisory Onboarding Video Series",
      companyName: "NextGen Financial Solutions",
      categoryName: "Video",
      code: "NGF-VID-302",
      description: "Motion graphics animated video suite explaining retail portfolio investment strategies.",
      date: "2026-08-10",
      status: "completed"
    },
    {
      name: "Cybersecurity Awareness & Phishing Defense",
      companyName: "CyberCore Interactive",
      categoryName: "eLearning",
      code: "CCI-SEC-401",
      description: "Gamified cyber hygiene course covering credential protection, phishing, and ransomware defense.",
      date: "2026-10-01",
      status: "active"
    },
    {
      name: "SOC 2 Type II Security Documentation",
      companyName: "CyberCore Interactive",
      categoryName: "PDF",
      code: "CCI-DOC-402",
      description: "Standard operating procedures and security architecture compliance guide.",
      date: "2026-09-01",
      status: "active"
    },
    {
      name: "Point-of-Sale Associate Training 2026",
      companyName: "BlueSky Retail Corp",
      categoryName: "eLearning",
      code: "BSR-POS-501",
      description: "Hands-on checkout system simulation and customer delight service training.",
      date: "2026-11-08",
      status: "active"
    }
  ];

  const projectMap = {};
  for (const p of projectsToSeed) {
    const comp = companyMap[p.companyName];
    const cat = categoryMap[p.categoryName];

    let proj = await Project.findOne({
      name: p.name,
      company: comp._id,
      category: cat._id
    });

    const payload = {
      name: p.name,
      company: comp._id,
      category: cat._id,
      code: p.code,
      description: p.description,
      date: p.date,
      status: p.status
    };

    if (!proj) {
      proj = await Project.create(payload);
      console.log(`  ➕ Project created: ${p.name} (${p.code})`);
    } else {
      Object.assign(proj, payload);
      await proj.save();
      console.log(`  ✓ Project updated: ${p.name} (${p.code})`);
    }
    projectMap[p.name] = proj;
  }

  // ==========================================
  // 5. SEED PROJECT PLANS & GANTT TASKS
  // ==========================================
  console.log("\n📊 Seeding Detailed Project Plans...");

  const plan1Project = projectMap["Compliance & Anti-Harassment 2026"];
  const pmUser = userMap["sarah.jenkins@demo.com"];
  const idUser = userMap["priya.patel@demo.com"];
  const idUser2 = userMap["alex.miller@demo.com"];
  const devUser = userMap["vikram.singh@demo.com"];
  const animUser = userMap["marcus.rossi@demo.com"];
  const designUser = userMap["ananya.deshmukh@demo.com"];
  const qaUser = userMap["neha.gupta@demo.com"];

  const plan1Tasks = [
    {
      id: "T-01",
      name: "Curriculum Outline & Learning Objectives",
      phaseId: "P-1",
      phaseName: "Analysis & Storyboard",
      role: "Instructional Designer",
      roleCategory: "ID",
      assignedResources: [{ user: idUser._id, name: idUser.name, email: idUser.email }],
      startDate: "2026-11-01",
      endDate: "2026-11-05",
      durationWorkingDays: 4,
      hours: 24,
      allocatedHours: 24,
      actualUsedHours: 24,
      status: "Completed",
      dependencies: []
    },
    {
      id: "T-02",
      name: "Detailed Interactive Storyboard (Modules 1-4)",
      phaseId: "P-1",
      phaseName: "Analysis & Storyboard",
      role: "Instructional Designer",
      roleCategory: "ID",
      assignedResources: [{ user: idUser._id, name: idUser.name, email: idUser.email }],
      startDate: "2026-11-06",
      endDate: "2026-11-15",
      durationWorkingDays: 8,
      hours: 48,
      allocatedHours: 48,
      actualUsedHours: 48,
      status: "Completed",
      dependencies: ["T-01"]
    },
    {
      id: "T-03",
      name: "UI Theme, Visual Style Guide & Asset Kit",
      phaseId: "P-2",
      phaseName: "Prototype & Graphic Design",
      role: "Graphic Designer",
      roleCategory: "DESIGNER",
      assignedResources: [{ user: designUser._id, name: designUser.name, email: designUser.email }],
      startDate: "2026-11-08",
      endDate: "2026-11-14",
      durationWorkingDays: 5,
      hours: 30,
      allocatedHours: 30,
      actualUsedHours: 30,
      status: "Completed",
      dependencies: ["T-01"]
    },
    {
      id: "T-04",
      name: "Character Illustration & 2D Motion Assets",
      phaseId: "P-2",
      phaseName: "Prototype & Graphic Design",
      role: "Animator",
      roleCategory: "ANIMATOR",
      assignedResources: [{ user: animUser._id, name: animUser.name, email: animUser.email }],
      startDate: "2026-11-12",
      endDate: "2026-11-20",
      durationWorkingDays: 7,
      hours: 42,
      allocatedHours: 42,
      actualUsedHours: 26,
      status: "In Progress",
      dependencies: ["T-03"]
    },
    {
      id: "T-05",
      name: "Storyline 360 Interactive Alpha Build",
      phaseId: "P-3",
      phaseName: "Alpha Development",
      role: "Storyline Developer",
      roleCategory: "DEVELOPER",
      assignedResources: [{ user: devUser._id, name: devUser.name, email: devUser.email }],
      startDate: "2026-11-15",
      endDate: "2026-11-28",
      durationWorkingDays: 10,
      hours: 70,
      allocatedHours: 70,
      actualUsedHours: 35,
      status: "In Progress",
      dependencies: ["T-02", "T-04"]
    },
    {
      id: "T-06",
      name: "Internal Quality Audit & SCORM 2004 Testing",
      phaseId: "P-4",
      phaseName: "Quality Assurance",
      role: "Quality Analyst",
      roleCategory: "QA",
      assignedResources: [{ user: qaUser._id, name: qaUser.name, email: qaUser.email }],
      startDate: "2026-11-29",
      endDate: "2026-12-05",
      durationWorkingDays: 5,
      hours: 32,
      allocatedHours: 32,
      actualUsedHours: 0,
      status: "Not Started",
      dependencies: ["T-05"]
    },
    {
      id: "T-07",
      name: "Final Gold Master LMS Package & Delivery",
      phaseId: "P-5",
      phaseName: "Gold Master Handover",
      role: "Manager",
      roleCategory: "PM",
      assignedResources: [{ user: pmUser._id, name: pmUser.name, email: pmUser.email }],
      startDate: "2026-12-06",
      endDate: "2026-12-08",
      durationWorkingDays: 2,
      hours: 12,
      allocatedHours: 12,
      actualUsedHours: 0,
      status: "Not Started",
      isMilestone: true,
      dependencies: ["T-06"]
    }
  ];

  let plan1 = await ProjectPlan.findOne({ project: plan1Project._id });
  const plan1Payload = {
    project: plan1Project._id,
    company: plan1Project.company,
    clientName: "Acme Global Learning",
    projectType: "storyline-360",
    projectTypes: ["storyline-360"],
    complexity: "Level 2",
    startDate: "2026-11-01",
    calculatedEndDate: "2026-12-08",
    courseLengthMinutes: 60,
    moduleCount: 4,
    totalWorkingDays: 28,
    totalCalendarDays: 38,
    estimatedEffortHours: 258,
    allocatedEffortHours: 258,
    actualUsedEffortHours: 163,
    projectManager: pmUser._id,
    assignedTeam: [
      { user: pmUser._id, name: pmUser.name, email: pmUser.email, roleCategory: "PM", designation: pmUser.designation, dailyHours: 7 },
      { user: idUser._id, name: idUser.name, email: idUser.email, roleCategory: "ID", designation: idUser.designation, dailyHours: 7 },
      { user: devUser._id, name: devUser.name, email: devUser.email, roleCategory: "DEVELOPER", designation: devUser.designation, dailyHours: 7 },
      { user: animUser._id, name: animUser.name, email: animUser.email, roleCategory: "ANIMATOR", designation: animUser.designation, dailyHours: 7 },
      { user: designUser._id, name: designUser.name, email: designUser.email, roleCategory: "DESIGNER", designation: designUser.designation, dailyHours: 7 },
      { user: qaUser._id, name: qaUser.name, email: qaUser.email, roleCategory: "QA", designation: qaUser.designation, dailyHours: 7 }
    ],
    phases: [
      { id: "P-1", name: "Analysis & Storyboard", taskIds: ["T-01", "T-02"] },
      { id: "P-2", name: "Prototype & Graphic Design", taskIds: ["T-03", "T-04"] },
      { id: "P-3", name: "Alpha Development", taskIds: ["T-05"] },
      { id: "P-4", name: "Quality Assurance", taskIds: ["T-06"] },
      { id: "P-5", name: "Gold Master Handover", taskIds: ["T-07"] }
    ],
    tasks: plan1Tasks
  };

  if (!plan1) {
    plan1 = await ProjectPlan.create(plan1Payload);
    console.log("  ➕ Project Plan created: Compliance & Anti-Harassment 2026");
  } else {
    Object.assign(plan1, plan1Payload);
    await plan1.save();
    console.log("  ✓ Project Plan updated: Compliance & Anti-Harassment 2026");
  }

  // Plan 2 for Good Manufacturing Practice (GMP) Certification
  const plan2Project = projectMap["Good Manufacturing Practice (GMP) Certification"];
  const devUser2 = userMap["david.chen@demo.com"];
  const qaUser2 = userMap["john.doe@demo.com"];

  const plan2Tasks = [
    {
      id: "GMP-01",
      name: "SOP Regulatory Analysis & Storyboard",
      phaseId: "P-1",
      phaseName: "Storyboarding",
      role: "Instructional Designer",
      roleCategory: "ID",
      assignedResources: [{ user: idUser2._id, name: idUser2.name, email: idUser2.email }],
      startDate: "2026-11-05",
      endDate: "2026-11-18",
      durationWorkingDays: 10,
      hours: 60,
      allocatedHours: 60,
      actualUsedHours: 60,
      status: "Completed",
      dependencies: []
    },
    {
      id: "GMP-02",
      name: "Cleanroom Vector Illustrations & Icons",
      phaseId: "P-2",
      phaseName: "Asset Design",
      role: "Graphic Designer",
      roleCategory: "DESIGNER",
      assignedResources: [{ user: designUser._id, name: designUser.name, email: designUser.email }],
      startDate: "2026-11-15",
      endDate: "2026-11-25",
      durationWorkingDays: 8,
      hours: 45,
      allocatedHours: 45,
      actualUsedHours: 30,
      status: "In Progress",
      dependencies: ["GMP-01"]
    },
    {
      id: "GMP-03",
      name: "Storyline Module Authoring & Knowledge Checks",
      phaseId: "P-3",
      phaseName: "Development",
      role: "Storyline Developer",
      roleCategory: "DEVELOPER",
      assignedResources: [{ user: devUser2._id, name: devUser2.name, email: devUser2.email }],
      startDate: "2026-11-20",
      endDate: "2026-12-10",
      durationWorkingDays: 15,
      hours: 90,
      allocatedHours: 90,
      actualUsedHours: 15,
      status: "In Progress",
      dependencies: ["GMP-02"]
    },
    {
      id: "GMP-04",
      name: "FDA 21 CFR Part 11 Compliance & QA Validation",
      phaseId: "P-4",
      phaseName: "Validation",
      role: "Quality Analyst",
      roleCategory: "QA",
      assignedResources: [{ user: qaUser2._id, name: qaUser2.name, email: qaUser2.email }],
      startDate: "2026-12-11",
      endDate: "2026-12-18",
      durationWorkingDays: 6,
      hours: 36,
      allocatedHours: 36,
      actualUsedHours: 0,
      status: "Not Started",
      dependencies: ["GMP-03"]
    }
  ];

  let plan2 = await ProjectPlan.findOne({ project: plan2Project._id });
  const plan2Payload = {
    project: plan2Project._id,
    company: plan2Project.company,
    clientName: "Apex Pharma Technologies",
    projectType: "storyline-360",
    projectTypes: ["storyline-360"],
    complexity: "Level 3",
    startDate: "2026-11-05",
    calculatedEndDate: "2026-12-18",
    courseLengthMinutes: 90,
    moduleCount: 5,
    totalWorkingDays: 35,
    totalCalendarDays: 44,
    estimatedEffortHours: 231,
    allocatedEffortHours: 231,
    actualUsedEffortHours: 105,
    projectManager: pmUser._id,
    assignedTeam: [
      { user: pmUser._id, name: pmUser.name, email: pmUser.email, roleCategory: "PM", designation: pmUser.designation, dailyHours: 7 },
      { user: idUser2._id, name: idUser2.name, email: idUser2.email, roleCategory: "ID", designation: idUser2.designation, dailyHours: 7 },
      { user: devUser2._id, name: devUser2.name, email: devUser2.email, roleCategory: "DEVELOPER", designation: devUser2.designation, dailyHours: 7 },
      { user: designUser._id, name: designUser.name, email: designUser.email, roleCategory: "DESIGNER", designation: designUser.designation, dailyHours: 7 },
      { user: qaUser2._id, name: qaUser2.name, email: qaUser2.email, roleCategory: "QA", designation: qaUser2.designation, dailyHours: 7 }
    ],
    phases: [
      { id: "P-1", name: "Storyboarding", taskIds: ["GMP-01"] },
      { id: "P-2", name: "Asset Design", taskIds: ["GMP-02"] },
      { id: "P-3", name: "Development", taskIds: ["GMP-03"] },
      { id: "P-4", name: "Validation", taskIds: ["GMP-04"] }
    ],
    tasks: plan2Tasks
  };

  if (!plan2) {
    plan2 = await ProjectPlan.create(plan2Payload);
    console.log("  ➕ Project Plan created: GMP Certification");
  } else {
    Object.assign(plan2, plan2Payload);
    await plan2.save();
    console.log("  ✓ Project Plan updated: GMP Certification");
  }

  // ==========================================
  // 6. SYNC TASKS INTO TASK COLLECTION
  // ==========================================
  console.log("\n📋 Syncing Tasks into Task Collection...");
  const allPlans = [
    { plan: plan1, tasks: plan1Tasks, projId: plan1Project._id },
    { plan: plan2, tasks: plan2Tasks, projId: plan2Project._id }
  ];

  for (const item of allPlans) {
    for (const t of item.tasks) {
      const assignedIds = (t.assignedResources || []).map((r) => r.user);
      const taskDoc = {
        project: item.projId,
        title: t.name,
        taskType: t.roleCategory === "ID" ? "Analysis" : t.roleCategory === "QA" ? "Output QA" : "Alpha",
        roleCategory: t.roleCategory,
        assignedTo: assignedIds,
        estimatedMinutes: (t.hours || 0) * 60,
        dueDate: t.endDate ? new Date(t.endDate) : null,
        status: t.status === "Completed" ? "completed" : t.status === "In Progress" ? "in_progress" : "open",
        description: `Phase: ${t.phaseName} | Role: ${t.role} | Days: ${t.durationWorkingDays}`
      };

      await Task.findOneAndUpdate(
        { project: item.projId, title: t.name },
        taskDoc,
        { upsert: true, new: true }
      );
      console.log(`  ✓ Synced task: "${t.name}"`);
    }
  }

  // ==========================================
  // 7. SEED COMPREHENSIVE HOLIDAYS (2026 & 2027)
  // ==========================================
  console.log("\n🗓️ Seeding Holidays (2026 - 2027)...");
  const holidays = [
    // 2026
    { name: "New Year's Day", date: "2026-01-01", type: "public" },
    { name: "Republic Day", date: "2026-01-26", type: "public" },
    { name: "Maha Shivratri", date: "2026-02-15", type: "optional" },
    { name: "Holi", date: "2026-03-04", type: "public" },
    { name: "Eid al-Fitr", date: "2026-03-20", type: "public" },
    { name: "Good Friday", date: "2026-04-03", type: "public" },
    { name: "Dr. Ambedkar Jayanti", date: "2026-04-14", type: "public" },
    { name: "Labour Day", date: "2026-05-01", type: "company" },
    { name: "Bakrid / Eid al-Adha", date: "2026-05-27", type: "public" },
    { name: "Independence Day", date: "2026-08-15", type: "public" },
    { name: "Raksha Bandhan", date: "2026-08-28", type: "optional" },
    { name: "Janmashtami", date: "2026-09-04", type: "optional" },
    { name: "Mahatma Gandhi Jayanti", date: "2026-10-02", type: "public" },
    { name: "Dussehra (Vijayadashami)", date: "2026-10-20", type: "public" },
    { name: "Diwali (Lakshmi Puja)", date: "2026-11-08", type: "public" },
    { name: "Diwali Balipratipada", date: "2026-11-09", type: "company" },
    { name: "Guru Nanak Jayanti", date: "2026-11-24", type: "public" },
    { name: "Christmas Day", date: "2026-12-25", type: "public" },
    { name: "Annual Year End Shutdown", date: "2026-12-31", type: "company" },

    // 2027
    { name: "New Year's Day 2027", date: "2027-01-01", type: "public" },
    { name: "Republic Day 2027", date: "2027-01-26", type: "public" },
    { name: "Holi 2027", date: "2027-03-23", type: "public" },
    { name: "Good Friday 2027", date: "2027-03-26", type: "public" },
    { name: "Labour Day 2027", date: "2027-05-01", type: "company" },
    { name: "Independence Day 2027", date: "2027-08-15", type: "public" },
    { name: "Gandhi Jayanti 2027", date: "2027-10-02", type: "public" },
    { name: "Diwali 2027", date: "2027-10-28", type: "public" },
    { name: "Christmas 2027", date: "2027-12-25", type: "public" }
  ];

  for (const h of holidays) {
    await Holiday.findOneAndUpdate(
      { date: h.date },
      { name: h.name, date: h.date, type: h.type },
      { upsert: true, new: true }
    );
    console.log(`  ✓ Holiday: ${h.date} - ${h.name} (${h.type})`);
  }

  // ==========================================
  // 8. SEED WORK SESSIONS & TIMESHEETS
  // ==========================================
  console.log("\n⏱️ Seeding Recent Work Sessions & Timesheets for Activity Reports...");
  const recentDates = ["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13"];

  const sampleSessions = [
    {
      user: idUser._id,
      project: plan1Project._id,
      taskTitle: "Detailed Interactive Storyboard (Modules 1-4)",
      date: "2026-11-12",
      accumulatedMinutes: 340,
      taskType: "Analysis",
      remarks: "Completed modules 1 and 2 interaction outlines and review feedback"
    },
    {
      user: devUser._id,
      project: plan1Project._id,
      taskTitle: "Storyline 360 Interactive Alpha Build",
      date: "2026-11-12",
      accumulatedMinutes: 390,
      taskType: "Alpha",
      remarks: "Integrated custom triggers, layers and SCORM tracking variables"
    },
    {
      user: animUser._id,
      project: plan1Project._id,
      taskTitle: "Character Illustration & 2D Motion Assets",
      date: "2026-11-12",
      accumulatedMinutes: 280,
      taskType: "Alpha",
      remarks: "Rendered SVG illustrations and animated character dialogue poses"
    },
    {
      user: designUser._id,
      project: plan1Project._id,
      taskTitle: "UI Theme, Visual Style Guide & Asset Kit",
      date: "2026-11-11",
      accumulatedMinutes: 310,
      taskType: "Alpha",
      remarks: "Delivered Figma button states, typography scales, and color schemes"
    },
    {
      user: devUser2._id,
      project: plan2Project._id,
      taskTitle: "Storyline Module Authoring & Knowledge Checks",
      date: "2026-11-13",
      accumulatedMinutes: 260,
      taskType: "Alpha",
      remarks: "Created cleanroom equipment assessment quiz with immediate feedback"
    },
    {
      user: qaUser._id,
      project: plan1Project._id,
      taskTitle: "Internal Quality Audit & SCORM 2004 Testing",
      date: "2026-11-13",
      accumulatedMinutes: 195,
      taskType: "Output QA",
      remarks: "LMS Cloud SCORM verification: score reporting and bookmarking tests"
    }
  ];

  for (const s of sampleSessions) {
    const existing = await WorkSession.findOne({
      user: s.user,
      project: s.project,
      date: s.date,
      taskTitle: s.taskTitle
    });

    if (!existing) {
      await WorkSession.create({
        user: s.user,
        project: s.project,
        taskTitle: s.taskTitle,
        date: s.date,
        status: "stopped",
        accumulatedMinutes: s.accumulatedMinutes,
        taskType: s.taskType,
        remarks: s.remarks,
        segments: [
          {
            start: new Date(`${s.date}T09:30:00.000Z`),
            end: new Date(`${s.date}T13:00:00.000Z`),
            manual: false
          },
          {
            start: new Date(`${s.date}T14:00:00.000Z`),
            end: new Date(`${s.date}T17:30:00.000Z`),
            manual: false
          }
        ]
      });
      console.log(`  ➕ WorkSession created for: ${s.taskTitle} (${s.date})`);
    } else {
      console.log(`  ✓ WorkSession exists for: ${s.taskTitle} (${s.date})`);
    }
  }

  // Seed corresponding Timesheets
  for (const s of sampleSessions) {
    const proj = await Project.findById(s.project);
    if (!proj) continue;

    const existingTs = await Timesheet.findOne({
      user: s.user,
      project: s.project,
      dateLogged: new Date(s.date)
    });

    if (!existingTs) {
      await Timesheet.create({
        user: s.user,
        company: proj.company,
        category: proj.category,
        project: proj._id,
        taskType: s.taskType === "Output QA" ? "Beta Development" : "Alpha Development",
        hours: Math.round((s.accumulatedMinutes / 60) * 10) / 10,
        remarks: s.remarks,
        dateLogged: new Date(s.date)
      });
      console.log(`  ➕ Timesheet logged for: ${s.date} (${proj.name})`);
    }
  }

  console.log("\n==========================================");
  console.log("🎉 ALL DUMMY DATA SEEDED SUCCESSFULLY!");
  console.log("==========================================");
  console.log("Credentials for testing:");
  console.log("  Super Admin: superadmin@demo.com | Password: Pass@123");
  console.log("  Admin:       admin@demo.com       | Password: Pass@123");
  console.log("  Manager:     sarah.jenkins@demo.com | Password: Pass@123");
  console.log("  Developer:   vikram.singh@demo.com  | Password: Pass@123");
  console.log("  Designer:    ananya.deshmukh@demo.com | Password: Pass@123");
  console.log("  QA:          neha.gupta@demo.com    | Password: Pass@123");
  console.log("==========================================\n");

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
