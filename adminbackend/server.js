const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const adminRoutes = require('./routes/admin');
const { getStates } = require('./controllers/states');
const { editCourse, toggleStatus } = require('./controllers/courses');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

