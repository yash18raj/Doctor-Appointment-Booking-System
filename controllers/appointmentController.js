const appointments = []; // In-memory storage of appointments

// function to check if two time slots overlap
function isTimeSlotOverlapping(existingStart, existingEnd, newStart, newEnd) {
    const existingStartTime = new Date(`2025-01-01T${existingStart}:00`);
    const existingEndTime = new Date(`2025-01-01T${existingEnd}:00`);
    const newStartTime = new Date(`2025-01-01T${newStart}:00`);
    const newEndTime = new Date(`2025-01-01T${newEnd}:00`);

    // Check if the time slots overlap
    return (existingStartTime < newEndTime && existingEndTime > newStartTime);
}

// Book Appointment API
exports.bookAppointment = (req, res) => {
    const { firstName, lastName, email, startTime, endTime, doctorName } = req.body;

    // Check if any appointment already exists with overlapping time slots
    const conflictingAppointment = appointments.find(appointment =>
        appointment.doctorName === doctorName &&
        isTimeSlotOverlapping(appointment.startTime, appointment.endTime, startTime, endTime)
    );

    if (conflictingAppointment) {
        return res.status(409).json({ error: 'Time slot is already booked or overlapping with another appointment.' });
    }

    // Create a new appointment
    const newAppointment = {
        firstName,
        lastName,
        email,
        startTime,
        endTime,
        doctorName
    };

    
    appointments.push(newAppointment);

    
    return res.status(200).json({
        message: 'Appointment booked successfully.',
        appointmentDetails: newAppointment
    });
};

// View Appointment Details API
exports.viewAppointment = (req, res) => {
    const { email } = req.params;

    // Find the appointment by email
    const appointment = appointments.find(app => app.email === email);

    if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
    }

    return res.status(200).json({ appointment });
};

// View All Appointments by Doctor API
exports.viewAppointmentsByDoctor = (req, res) => {
    const { doctorName } = req.params;

    // Find all appointments for the given doctor
    const doctorAppointments = appointments.filter(app => app.doctorName === doctorName);

    if (doctorAppointments.length === 0) {
        return res.status(404).json({ error: 'No appointments found for this doctor.' });
    }

    return res.status(200).json({ appointments: doctorAppointments });
};

// Cancel Appointment API
exports.cancelAppointment = (req, res) => {
    const { email, startTime, endTime } = req.body;

    // Find the appointment to cancel
    const appointmentIndex = appointments.findIndex(app =>
        app.email === email && app.startTime === startTime && app.endTime === endTime
    );

    if (appointmentIndex === -1) {
        return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Remove the appointment from the array
    appointments.splice(appointmentIndex, 1);

    return res.status(200).json({ message: 'Appointment cancelled successfully.' });
};

// Modify Appointment API
exports.modifyAppointment = (req, res) => {
    const { email, originalStartTime, originalEndTime, newStartTime, newEndTime } = req.body;

    // Find the appointment to modify
    const appointment = appointments.find(app =>
        app.email === email && app.startTime === originalStartTime && app.endTime === originalEndTime
    );

    if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Check if the new time slot conflicts with an existing appointment
    const conflictingAppointment = appointments.find(app =>
        app.doctorName === appointment.doctorName &&
        isTimeSlotOverlapping(app.startTime, app.endTime, newStartTime, newEndTime)
    );

    if (conflictingAppointment) {
        return res.status(409).json({ error: 'New time slot is overlapping with an existing appointment.' });
    }

    // Update the time slot of the appointment
    appointment.startTime = newStartTime;
    appointment.endTime = newEndTime;

    return res.status(200).json({
        message: 'Appointment modified successfully.',
        appointmentDetails: appointment
    });
};
