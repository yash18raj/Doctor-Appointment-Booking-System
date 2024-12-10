const express = require('express');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
// Middleware
app.use(express.json());

// Mount routes
app.use('/api/appointments', appointmentRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
