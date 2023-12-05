const express = require('express');
const router = express.Router();
const { checkUser, makeUserAdmin, createUser, getUser, getUserApplications } = require('../controllers/userController.js');
const { createApplication, updateApplication, getApplication, getMyApplications, getApplicationStatistics, getAllApplications, updateApplicationStatus, approveApplication, rejectApplication, uploadDocumentToApplication, getDocumentsForApplication } = require('../controllers/applicationController.js');
const { createDocument, getDocument, updateDocumentStatus } = require('../controllers/documentController.js');
const { uploadFiles, handleFileUploads } = require('../controllers/upload.js');
const checkUserRole = require('../middlewares/middleware.js');
const { createRequirement, getRequirements } = require('../controllers/requirementController.js');

// User Routes
router.post('/check-user', checkUser);
router.post('/users', checkUserRole, createUser);
router.post('/users/make-admin', checkUserRole, makeUserAdmin);
router.get('/users/:address', getUser);
router.get('/users/:address/applications', getUserApplications);

//Requirement Routes
router.post('/requirements', createRequirement);
router.get('/requirements', getRequirements);

// Application Routes
router.post('/upload', uploadFiles, handleFileUploads);

router.post('/applications', createApplication);
router.post('/applications/stats', checkUserRole, getApplicationStatistics);
router.post('/applications/admin', checkUserRole, getAllApplications);
router.post('/applications/:appId', getApplication);
router.put('/applications/:appId', updateApplication);
router.post('/applications/:appId/documents', uploadDocumentToApplication);
router.get('/applications/:appId/documents', getDocumentsForApplication);
router.put('/applications/status/:appId', checkUserRole, updateApplicationStatus);
router.post('/my-applications', getMyApplications);
router.put('/approveApplication/:appId', checkUserRole, approveApplication);
router.put('/rejectApplication/:appId', checkUserRole, rejectApplication);

// Document Routes
router.post('/applications/:appId/documents', createDocument);
router.get('/applications/:appId/documents/:docId', getDocument);
router.put('/documents/:documentId/status', updateDocumentStatus)

module.exports = router;
