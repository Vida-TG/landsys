const express = require('express');
const router = express.Router();
const { checkUser, makeUserAdmin, createUser, getUser, getUserApplications } = require('../controllers/userController.js');
const { createApplication, updateApplication, getApplication, getMyApplications, getAllApplications, approveApplication, rejectApplication, uploadDocumentToApplication, getDocumentsForApplication } = require('../controllers/applicationController.js');
const { createDocument, getDocument } = require('../controllers/documentController.js');
const checkUserRole = require('../middlewares/middleware.js');

// User Routes
router.post('/check-user', checkUser);
router.post('/users', checkUserRole, createUser);
router.post('/users/make-admin/:address', checkUserRole, makeUserAdmin);
router.get('/users/:address', getUser);
router.get('/users/:address/applications', getUserApplications);

// Application Routes
router.post('/applications', createApplication);
router.get('/applications/:appId', getApplication);
router.post('/applications/admin', checkUserRole, getAllApplications);``
router.put('/applications/:appId', checkUserRole, updateApplication);
router.post('/applications/:appId/documents', uploadDocumentToApplication);
router.get('/applications/:appId/documents', getDocumentsForApplication);
router.get('/my-applications', getMyApplications);
router.put('/approveApplication/:appId', checkUserRole, approveApplication);
router.put('/rejectApplication/:appId', checkUserRole, rejectApplication);

// Document Routes
router.post('/applications/:appId/documents', createDocument);
router.get('/applications/:appId/documents/:docId', getDocument);

module.exports = router;
