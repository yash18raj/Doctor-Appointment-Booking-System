// In-memory storage for appointments (can be replaced with database later)
let appointments = [];

const bookAppointment = (req, res) => {
    const { firstName, lastName, email, timeSlot, doctorName } = req.body;

    // Check if the time slot is already booked for the given doctor
    const isTimeSlotTaken = appointments.some(
        (appointment) => appointment.doctorName === doctorName && appointment.timeSlot === timeSlot
    );

    if (isTimeSlotTaken) {
        return res.status(409).json({ error: 'Time slot is already booked.' });
    }

    // Create a new appointment object
    const newAppointment = { firstName, lastName, email, timeSlot, doctorName };

    // Store the appointment in the in-memory array
    appointments.push(newAppointment);

    // Return the success message and the full appointment details
    return res.status(200).json({
        message: 'Appointment booked successfully.',
        appointment: newAppointment
    });
};

const viewAppointment = (req, res) => {
    const { email } = req.params;

    // Find the appointment by email
    const appointment = appointments.find((appt) => appt.email === email);

    if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
    }

    return res.status(200).json({ appointment });
};

const viewAllAppointmentsByDoctor = (req, res) => {
    const { doctorName } = req.params;

    // Find all appointments for the given doctor
    const doctorAppointments = appointments.filter(
        (appt) => appt.doctorName === doctorName
    );

    if (doctorAppointments.length === 0) {
        return res.status(404).json({ error: 'No appointments found for this doctor.' });
    }

    return res.status(200).json({ appointments: doctorAppointments });
};

const cancelAppointment = (req, res) => {
    const { email, timeSlot } = req.body;

    // Find the appointment and remove it
    const index = appointments.findIndex((appt) => appt.email === email && appt.timeSlot === timeSlot);

    if (index === -1) {
        return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Remove the appointment from the array
    appointments.splice(index, 1);

    return res.status(200).json({ message: 'Appointment cancelled successfully.' });
};

const modifyAppointment = (req, res) => {
    const { email, originalTimeSlot, newTimeSlot } = req.body;

    if (!email || !originalTimeSlot || !newTimeSlot) {
        return res.status(400).json({ error: 'Email, original time slot, and new time slot are required.' });
    }

    // Find the index of the appointment to modify
    const appointmentIndex = appointments.findIndex(
        (appointment) =>
            appointment.email === email && appointment.timeSlot === originalTimeSlot
    );

    if (appointmentIndex === -1) {
        return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Check if the new time slot is already booked for the same doctor
    const isTimeSlotConflict = appointments.some(
        (appointment) =>
            appointment.timeSlot === newTimeSlot &&
            appointment.doctorName === appointments[appointmentIndex].doctorName
    );

    if (isTimeSlotConflict) {
        return res.status(409).json({ error: 'New time slot is already booked.' });
    }

    // Update the appointment time slot
    appointments[appointmentIndex].timeSlot = newTimeSlot;

    res.status(200).json({
        message: 'Appointment modified successfully.',
        updatedAppointment: appointments[appointmentIndex],
    });
};

module.exports = {
    bookAppointment,
    viewAppointment,
    viewAllAppointmentsByDoctor,
    cancelAppointment,
    modifyAppointment
};
