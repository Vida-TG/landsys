const Requirement = require('../models/RequirementModel.js');
const RequiredDocument = require('../models/ReqDocsModel.js');

const createRequirement = async (req, res) => {
  try {
    const { applicationName, requiredDocuments } = req.body;

    const requiredDocumentsArray = Object.entries(requiredDocuments).map(([document, fee]) => ({
      document,
      fee,
    }));

    const createdDocuments = await RequiredDocument.create(requiredDocumentsArray);

    const requirement = new Requirement({
      applicationName,
      requiredDocuments: createdDocuments.map(doc => doc._id),
    });

    await requirement.save();

    res.json({ status: 'success', message: 'Saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed' });
  }
};

const getRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find({}).populate('requiredDocuments');

    res.json(requirements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the requirements' });
  }
};

module.exports = { createRequirement, getRequirements };
