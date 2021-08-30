const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { transformUser } = require("./merge");

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map((singleUser) => {
        return transformUser(singleUser);
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
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
};