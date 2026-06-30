import mongoose from "mongoose";
import Worker from "../models/worker.model.js";

const workers = [
  {
    name: "Rahul Sharma",
    phone: "6265967762",
    email: "rahul.sharma@example.com",
    address: "Skye Corporate Park, Vijay Nagar, Indore",
    department: "waste_management",
    location: { type: 'Point', coordinates: [75.8992, 22.7643] },
    skills: ["general_worker", "cleaning"],
    status: "available"
  },
  {
    name: "Amit Verma",
    phone: "6265967762",
    email: "amit.verma@example.com",
    address: "Vijay Nagar, Indore",
    department: "public_works",
    location: { type: 'Point', coordinates: [75.8992, 22.7643] },
    skills: ["general_worker", "repair", "construction"],
    status: "available"
  },
  {
    name: "Suresh Patel",
    phone: "6265967762",
    email: "suresh.patel@example.com",
    address: "Scheme No. 54, Indore",
    department: "water_supply",
    location: { type: 'Point', coordinates: [75.8992, 22.7643] },
    skills: ["plumber", "pipe_repair", "general_worker"],
    status: "available"
  },
  {
    name: "Vikas Yadav",
    phone: "6265967762",
    email: "vikas.yadav@example.com",
    address: "New Palasia, Indore",
    department: "electricity",
    location: { type: 'Point', coordinates: [75.8992, 22.7643] },
    skills: ["electrician", "wiring", "general_worker"],
    status: "available"
  },
  {
    name: "Manoj Gupta",
    phone: "6265967762",
    email: "manoj.gupta@example.com",
    address: "Rajwada, Indore",
    department: "other",
    location: { type: 'Point', coordinates: [75.8992, 22.7643] },
    skills: ["general_worker", "cleaning"],
    status: "available"
  },
  {
    name: "Deepak Joshi",
    phone: "6265967762",
    email: "deepak.joshi@example.com",
    address: "BDA Scheme No. 140, Indore",
    department: "waste_management",
    location: { type: 'Point', coordinates: [75.8800, 22.7500] },
    skills: ["general_worker", "cleaning", "driver"],
    status: "available"
  },
  {
    name: "Pradeep Singh",
    phone: "6265967762",
    email: "pradeep.singh@example.com",
    address: "MR 10 Road, Indore",
    department: "public_works",
    location: { type: 'Point', coordinates: [75.9100, 22.7200] },
    skills: ["road_repair", "construction", "heavy_machinery"],
    status: "available"
  },
  {
    name: "Ravi Dubey",
    phone: "6265967762",
    email: "ravi.dubey@example.com",
    address: "Annapurna Road, Indore",
    department: "water_supply",
    location: { type: 'Point', coordinates: [75.8700, 22.7400] },
    skills: ["plumber", "pipe_repair", "general_worker"],
    status: "available"
  },
  {
    name: "Rajesh Khanna",
    phone: "6265967762",
    email: "rajesh.khanna@example.com",
    address: "Bhawarkua, Indore",
    department: "electricity",
    location: { type: 'Point', coordinates: [75.8850, 22.7300] },
    skills: ["electrician", "solar_tech", "general_worker"],
    status: "available"
  },
  {
    name: "Neha Tiwari",
    phone: "6265967762",
    email: "neha.tiwari@example.com",
    address: "Scheme No. 78, Vijay Nagar, Indore",
    department: "other",
    location: { type: 'Point', coordinates: [75.8950, 22.7700] },
    skills: ["general_worker", "painting", "cleaning"],
    status: "available"
  },
  {
    name: "Sunil Rathore",
    phone: "6265967762",
    email: "sunil.rathore@example.com",
    address: "LIG Colony, Indore",
    department: "waste_management",
    location: { type: 'Point', coordinates: [75.9050, 22.7100] },
    skills: ["driver", "cleaning", "general_worker"],
    status: "available"
  },
  {
    name: "Anil Kushwaha",
    phone: "6265967762",
    email: "anil.kushwaha@example.com",
    address: "Tejaji Nagar, Indore",
    department: "public_works",
    location: { type: 'Point', coordinates: [75.9200, 22.7600] },
    skills: ["construction", "road_repair", "general_worker"],
    status: "available"
  },
  {
    name: "Mukesh Prajapati",
    phone: "6265967762",
    email: "mukesh.prajapati@example.com",
    address: "Ranjit Hanuman, Indore",
    department: "water_supply",
    location: { type: 'Point', coordinates: [75.8600, 22.7550] },
    skills: ["plumber", "general_worker"],
    status: "available"
  },
  {
    name: "Santosh Kori",
    phone: "6265967762",
    email: "santosh.kori@example.com",
    address: "Navlakha, Indore",
    department: "electricity",
    location: { type: 'Point', coordinates: [75.8880, 22.7150] },
    skills: ["electrician", "general_worker"],
    status: "available"
  },
  {
    name: "Pooja Verma",
    phone: "6265967762",
    email: "pooja.verma@example.com",
    address: "Sapna Sangeeta Road, Indore",
    department: "other",
    location: { type: 'Point', coordinates: [75.8750, 22.7800] },
    skills: ["cleaning", "general_worker"],
    status: "available"
  }
];

async function seedWorkers() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO);
    console.log("Connected.");

    await Worker.deleteMany({});
    await Worker.collection.dropIndexes();
    console.log("Cleared existing workers and indexes.");

    const created = await Worker.insertMany(workers);
    console.log(`Seeded ${created.length} workers:`);
    created.forEach(w => console.log(`  - ${w.name} (${w.department})`));

    await mongoose.disconnect();
    console.log("Done.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seedWorkers();
