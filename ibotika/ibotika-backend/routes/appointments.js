const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const upload = require('../middleware/upload');

// Create new appointment
router.post('/', upload.single('prescription'), appointmentController.create);

// Get all appointments
router.get('/', appointmentController.getAll);

// Get specific appointment
router.get('/:id', appointmentController.getById);

// Update appointment
router.put('/:id', upload.single('prescription'), appointmentController.update);

// Delete appointment
router.delete('/:id', appointmentController.delete);

// Cancel appointment (new route)
router.put('/:id/cancel', appointmentController.cancel);

module.exports = router;