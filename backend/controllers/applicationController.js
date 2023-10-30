const Application = require('../models/ApplicationModel.js');
const Document = require('../models/DocumentModel.js');
const User = require('../models/UserModel.js');


 const createApplication = async (req, res) => {
  try {
    const { address, applicationName } = req.body;
    const user = await User.findOne({ address });
    
    const application = new Application({
      userId: user._id,
      applicationName,
    });
    
    await application.save();
    user.applications.push(application);
    await user.save();

    res.json({ application });
  } catch (error) {
    res.status(500).json({ error: 'Application creation failed' });
  }
};



const getMyApplications = async (req, res) => {
    try {
      const { address } = req.body;
      const user = await User.findOne({ address });
      const applications = await Application.find({userId: user._id}).populate('userId').populate('documents');
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve applications' });
    }
};

const getApplication = async (req, res) => {
  try {
    const { address } = req.body;
    const { appId } = req.params;
    const user = await User.findOne({ address });
    
    const application = await Application.findOne({ _id: appId, userId: user._id });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or user is not the owner' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the application' });
  }
};



const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          applications: { $push: '$$ROOT' },
        },
      },
    ]);

    const groupedApplications = {};
    const allStatusTypes = ['Requested', 'Pending', 'Approved', 'Rejected'];

    allStatusTypes.forEach(async (status) => {
      groupedApplications[status] = {
        count: 0,
        applications: [],
      };
    });

    const populatedApplications = await Promise.all(
      applications.map(async (group) => {
        const status = group._id || 'None';
        const applications = await Application.populate(group.applications, 'documents');
        return {
          status,
          applications,
        };
      })
    );

    populatedApplications.forEach((group) => {
      groupedApplications[group.status] = {
        count: group.applications.length,
        applications: group.applications,
      };
    });

    res.json(groupedApplications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve applications' });
  }
};


  

const approveApplication = async (req, res) => {
    try {
      const { appId } = req.params;
      const application = await Application.findById(appId);
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      application.status = 'Approved';
      await application.save();
  
      res.json({ message: 'Application approved' });
    } catch (error) {
      res.status(500).json({ error: 'Approval failed' });
    }
};
  
const rejectApplication = async (req, res) => {
    try {
      const { appId } = req.params;
      const application = await Application.findById(appId);
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      application.status = 'Rejected';
      await application.save();
  
      res.json({ message: 'Application rejected' });
    } catch (error) {
      res.status(500).json({ error: 'Rejection failed' });
    }
};
  


const updateApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { price, status } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.fee = price || application.fee;
    application.status = status || "Pending";

    await application.save();

    res.json({ status: 'success', message: 'Saved successfully' });
  } catch (error) {
    console.log(error)
    res.json({ status: 'error', message: 'Could not be saved' });
  }
};



const uploadDocumentToApplication = async (req, res) => {
    try {
      const { appId } = req.params;
      const { documentName } = req.body;
      const application = await Application.findById(appId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      const document = new Document({
        user: application.userId,
        document: documentName,
      });
      await document.save();
      console.log(document)

      
  
      application.documents.push(document);
      application.status = "Pending";
      await application.save();
  
      res.json({ status: 'success', message: 'Document added to application' });
    } catch (error) {
      console.log(error)
      res.json({ status: 'error', message: 'Document could not be added' });
    }
};

  

const getDocumentsForApplication = async (req, res) => {
    try {
      const { appId } = req.params;
      const application = await Application.findById(appId).populate('documents');
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      res.json(application.documents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve documents' });
    }
};


module.exports = { createApplication, updateApplication, getApplication, getMyApplications, getAllApplications, approveApplication, rejectApplication, uploadDocumentToApplication, getDocumentsForApplication }