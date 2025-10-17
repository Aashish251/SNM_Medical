const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const registrationController = require('../controllers/registration');

router.get('/dropdown-data', registrationController.getDropdownData);
router.get('/cities/:stateId', registrationController.getCities);
router.post('/check-email', registrationController.checkEmail);
router.post('/register', registrationController.registerUser);

router.post(
  '/register',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
  ]),
  registrationController.registerUser
);


module.exports = router;
