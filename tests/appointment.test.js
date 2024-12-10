const request = require('supertest'); // Import supertest for HTTP assertions
const app = require('../app'); // Import the main app 

describe('Doctor Appointment Booking System', () => {
    // Test case for booking an appointment successfully
    it('should book an appointment successfully', async () => {
        const res = await request(app).post('/api/appointments/book').send({
            firstName: 'Yash',
            lastName: 'Raj',
            email: 'yash.raj@gmail.com',
            timeSlot: '10:00 AM - 11:00 AM',
            doctorName: 'Dr. Jha',
        });
        
        // The appointment booking was successful
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Appointment booked successfully.');
        expect(res.body.appointment).toMatchObject({
            firstName: 'Yash',
            lastName: 'Raj',
            email: 'yash.raj@gmail.com',
            timeSlot: '10:00 AM - 11:00 AM',
            doctorName: 'Dr. Jha',
        });
    });

    // Test case to handle booking a conflicting appointment (same time slot)
    it('should not allow booking a conflicting appointment', async () => {
        // First, we book an appointment for Raj Maurya with Dr. Narayan
        await request(app).post('/api/appointments/book').send({
            firstName: 'Raj',
            lastName: 'Maurya',
            email: 'raj.maurya@gmail.com',
            timeSlot: '11:00 AM - 12:00 PM',
            doctorName: 'Dr. Narayan',
        });
        
        // Then, we try to book the same time slot for Sahil Baidya with Dr. Narayan
        const res = await request(app).post('/api/appointments/book').send({
            firstName: 'Sahil',
            lastName: 'Baidya',
            email: 'sahil.baidya@gmail.com',
            timeSlot: '11:00 AM - 12:00 PM',
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
            timeSlot: '10:00 AM - 11:00 AM',
            doctorName: 'Dr. Jha',
        });
    });

    // Test case for cancelling an appointment
    it('should cancel an appointment', async () => {
        const res = await request(app).delete('/api/appointments/cancel').send({
            email: 'yash.raj@gmail.com',
            timeSlot: '10:00 AM - 11:00 AM',
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
            timeSlot: '12:00 PM - 01:00 PM',
            doctorName: 'Dr. Narayan',
        });

        const res = await request(app).put('/api/appointments/modify').send({
            email: 'raj.maurya@gmail.com',
            originalTimeSlot: '12:00 PM - 01:00 PM',
            newTimeSlot: '01:00 PM - 02:00 PM',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Appointment updated successfully.');
        expect(res.body.appointment).toMatchObject({
            firstName: 'Raj',
            lastName: 'Maurya',
            email: 'raj.maurya@gmail.com',
            timeSlot: '01:00 PM - 02:00 PM',
            doctorName: 'Dr. Narayan',
        });
    });
});
