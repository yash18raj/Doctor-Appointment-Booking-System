const request = require('supertest'); // Import supertest for HTTP assertions
const app = require('../app'); // Import the main app 

describe('Doctor Appointment Booking System', () => {
    // Test case for booking an appointment successfully
    it('should book an appointment successfully', async () => {
        const res = await request(app).post('/api/appointments/book').send({
            firstName: 'Yash',
            lastName: 'Raj',
            email: 'yash.raj@gmail.com',
            startTime: '10:00',
            endTime: '11:00',
            doctorName: 'Dr. Jha',
        });

        // The appointment booking was successful
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Appointment booked successfully.');
        expect(res.body.appointment).toMatchObject({
            firstName: 'Yash',
            lastName: 'Raj',
            email: 'yash.raj@gmail.com',
            startTime: '10:00',
            endTime: '11:00',
            doctorName: 'Dr. Jha',
        });
    });

    // Test case to handle booking a conflicting appointment (overlapping time slot)
    it('should not allow booking a conflicting appointment', async () => {
        // First, we book an appointment for Raj Maurya with Dr. Narayan
        await request(app).post('/api/appointments/book').send({
            firstName: 'Raj',
            lastName: 'Maurya',
            email: 'raj.maurya@gmail.com',
            startTime: '11:00',
            endTime: '12:00',
            doctorName: 'Dr. Narayan',
        });

        // Then, we try to book an overlapping time slot for Sahil Baidya with Dr. Narayan
        const res = await request(app).post('/api/appointments/book').send({
            firstName: 'Sahil',
            lastName: 'Baidya',
            email: 'sahil.baidya@gmail.com',
            startTime: '11:30',
            endTime: '12:30',
            doctorName: 'Dr. Narayan',
        });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe('Time slot is already booked.');
    });

    // Test case for viewing an appointment by email
    it('should view an appointment by email', async () => {
        const res = await request(app).get('/api/appointments/view/yash.raj@gmail.com');
        expect(res.statusCode).toBe(200);
        expect(res.body.appointment.email).toBe('yash.raj@gmail.com');
        expect(res.body.appointment).toMatchObject({
            firstName: 'Yash',
            lastName: 'Raj',
            email: 'yash.raj@gmail.com',
            startTime: '10:00',
            endTime: '11:00',
            doctorName: 'Dr. Jha',
        });
    });

    // Test case for cancelling an appointment
    it('should cancel an appointment', async () => {
        const res = await request(app).delete('/api/appointments/cancel').send({
            email: 'yash.raj@gmail.com',
            startTime: '10:00',
            endTime: '11:00',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Appointment cancelled successfully.');
    });

    // Test case for modifying an appointment
    it('should modify an appointment time slot successfully', async () => {
        await request(app).post('/api/appointments/book').send({
            firstName: 'Raj',
            lastName: 'Maurya',
            email: 'raj.maurya@gmail.com',
            startTime: '12:00',
            endTime: '13:00',
            doctorName: 'Dr. Narayan',
        });

        const res = await request(app).put('/api/appointments/modify').send({
            email: 'raj.maurya@gmail.com',
            originalStartTime: '12:00',
            originalEndTime: '13:00',
            newStartTime: '13:00',
            newEndTime: '14:00',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Appointment updated successfully.');
        expect(res.body.appointment).toMatchObject({
            firstName: 'Raj',
            lastName: 'Maurya',
            email: 'raj.maurya@gmail.com',
            startTime: '13:00',
            endTime: '14:00',
            doctorName: 'Dr. Narayan',
        });
    });
});
