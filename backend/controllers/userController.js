const User = require('../models/UserModel.js');
const Application = require('../models/ApplicationModel.js');



const checkUser = async (req, res) => {
  try {
    const { address } = req.body;

    const existingUser = await User.findOne({ address });

    if (existingUser) {
      const user = await User.findById(existingUser._id)
        .populate({
          path: 'applications',
          populate: {
            path: 'documents',
          },
        });

      res.json({
        isNewUser: false,
        address: user.address,
        role: user.role,
        applications: user.applications,
      });
    } else {
      const newUser = new User({ address });
      await newUser.save();

      res.json({
        isNewUser: true,
        address: newUser.address,
        role: newUser.role,
        applications: [],
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'User check failed' });
  }
};





const makeUserAdmin = async (req, res) => {
  try {
    const { address } = req.params;
    const user = await User.findOne({ address });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    res.json({ message: 'User is now an admin' });
  } catch (error) {
    res.status(500).json({ error: 'Admin role assignment failed' });
  }
};




const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'User creation failed' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.address });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'User retrieval failed' });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.address }).populate('applications');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.applications);
  } catch (error) {
    res.status(500).json({ error: 'Applications retrieval failed' });
  }
};


module.exports = { checkUser, makeUserAdmin, createUser, getUser, getUserApplications }