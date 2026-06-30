import { connectdb } from "../db/connectdb.js";
import workerModel from "../models/worker.model.js";

const updatePhone = async () => {
  await connectdb();
  const result = await workerModel.updateMany({}, { phone: "6265967762" });
  console.log(`Updated ${result.modifiedCount} workers to phone: 6265967762`);
  process.exit(0);
};

updatePhone();
