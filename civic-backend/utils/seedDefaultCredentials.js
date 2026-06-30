import User from "../models/user.model.js";
import { Officer } from "../models/officer.model.js";

export const seedDefaultAccounts = async () => {
  try {
    const defaultUserEmail = "nikhil123@gmail.com";
    const defaultOfficerEmail = "nikhill123@gmail.com";
    const defaultPassword = "Nikhil@123";

    const existingUser = await User.findOne({ email: defaultUserEmail });
    if (!existingUser) {
      await User.create({
        name: "Nikhil",
        email: defaultUserEmail,
        phone: "0000000000",
        password: defaultPassword,
      });
      console.log(`Seeded default user: ${defaultUserEmail}`);
    } else {
      console.log(`Default user already exists: ${defaultUserEmail}`);
    }

    const existingOfficer = await Officer.findOne({ email: defaultOfficerEmail });
    if (!existingOfficer) {
      await Officer.create({
        name: "Nikhil Officer",
        department: "public_works",
        email: defaultOfficerEmail,
        phone: "0000000000",
        address: "Default Address",
        location: { lat: 0, lon: 0 },
        city: "Default",
        password: defaultPassword,
      });
      console.log(`Seeded default officer: ${defaultOfficerEmail}`);
    } else {
      console.log(`Default officer already exists: ${defaultOfficerEmail}`);
    }
  } catch (error) {
    console.error("Error seeding default credentials:", error);
  }
};
