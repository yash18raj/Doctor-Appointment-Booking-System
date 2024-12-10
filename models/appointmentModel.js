let appointments = [];

const addAppointment = (appointment) => {
    appointments.push(appointment);
};

const findAppointment = (email) => {
    return appointments.find((appt) => appt.email === email);
};

const findAppointmentsByDoctor = (doctorName) => {
    return appointments.filter((appt) => appt.doctorName === doctorName);
};

const removeAppointment = (email, timeSlot) => {
    const index = appointments.findIndex(
        (appt) => appt.email === email && appt.timeSlot === timeSlot
    );
    if (index !== -1) {
        return appointments.splice(index, 1)[0];
    }
    return null;
};

const updateAppointment = (email, timeSlot, newTimeSlot) => {
    const appointment = appointments.find(
        (appt) => appt.email === email && appt.timeSlot === timeSlot
    );
    if (appointment) {
        appointment.timeSlot = newTimeSlot;
        return appointment;
    }
    return null;
};

module.exports = {
    addAppointment,
    findAppointment,
    findAppointmentsByDoctor,
    removeAppointment,
    updateAppointment,
};
