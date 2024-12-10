const express = require('express');
const {
    bookAppointment,
    viewAppointment,
    viewAllAppointmentsByDoctor,
    cancelAppointment,
    modifyAppointment,
} = require('../controllers/appointmentController');

const router = express.Router();

router.post('/book', bookAppointment); // Book an appointment
router.get('/view/:email', viewAppointment); // View appointment by email
router.get('/doctor/:doctorName', viewAllAppointmentsByDoctor); // View appointments by doctor
router.delete('/cancel', cancelAppointment); // Cancel an appointment
router.put('/modify', modifyAppointment); // Modify an appointment

module.exports = router;
