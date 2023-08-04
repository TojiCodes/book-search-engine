const { User } = require('../models');

const resolvers = {
Query: {
    getSingleUser: async (_, args, context) => {
      const user = context.user || args;
      const foundUser = await User.findOne({
        $or: [{ _id: user._id }, { username: user.username }],
    });

    if (!foundUser) {
        throw new Error('Cannot find a user with this id!');
    }

    return foundUser;
    },

    login: async (_, { username, email, password }) => {
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new Error("Can't find this user");
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
        throw new Error('Wrong password!');
    }

    const token = signToken(user);

    return { token, user };
    },
},

Mutation: {
    createUser: async (_, { userData }) => {
    const user = await User.create(userData);

    if (!user) {
        throw new Error('Something is wrong!');
    }

    const token = signToken(user);

    return { token, user };
    },

    saveBook: async (_, { bookData }, context) => {
    const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        throw new Error('Failed to update user');
    }

    return updatedUser;
    },

    deleteBook: async (_, { bookId }, context) => {
    const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
    }

    return updatedUser;
    },
},
};

module.exports = resolvers;
