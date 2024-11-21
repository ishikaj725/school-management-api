const db = require('../config/db');
const haversine = require('haversine-distance');

exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid input data.' });
    }

    // Insert school into database
    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({ message: 'School added successfully!', schoolId: result.insertId });
    });
};

exports.listSchools = (req, res) => {
    const { latitude, longitude } = req.query;

    // Validation
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

    // Fetch schools from database
    db.query('SELECT * FROM schools', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error.' });
        }

        // Calculate distances and sort
        const sortedSchools = results.map((school) => {
            const schoolLocation = { latitude: school.latitude, longitude: school.longitude };
            return {
                ...school,
                distance: haversine(userLocation, schoolLocation)
            };
        }).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    });
};
