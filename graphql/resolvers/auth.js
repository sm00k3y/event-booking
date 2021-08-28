const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map((singleUser) => {
        return { ...singleUser._doc, _id: singleUser.id };
      });
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already!");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null, id: result.id };
    } catch (err) {
      throw err;
    }
  },
};
