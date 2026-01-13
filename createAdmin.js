const bcrypt = require("bcryptjs");
const User = require("./model/user");

const seedAdmin = async () => {
  try {
    const email = "fitnessambassador84@gmail.com";

    const exists = await User.findOne({ email });

    if (exists) {
      console.log("Admin already exists in User collection");
      return;
    }

    const hashedPassword = await bcrypt.hash("Fitness@84Admin", 10);

    await User.create({
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin successfully saved in User collection as ADMIN");
  } catch (err) {
    console.error("Admin seed error:", err.message);
  }
};

module.exports = seedAdmin;
