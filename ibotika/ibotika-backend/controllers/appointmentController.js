// controllers/appointmentController.js
const db = require('../config/database');

const appointmentController = {
  // Create new appointment
  create: async (req, res) => {
    try {
      // Input validation
      const { name, phone, date, time, reason } = req.body;
      const status = req.body.status || 'pending';
      const prescription_file = req.file ? req.file.filename : null;

      // Validate required fields
      if (!name || !phone || !date || !time) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }

      // Validate date range
      const today = new Date();
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3); // Allow up to 3 months in advance

      const appointmentDate = new Date(date);
      if (appointmentDate < today || appointmentDate > maxDate) {
        return res.status(400).json({
          message: 'Appointment date must be within the next 3 months and cannot be in the past',
        });
      }

      // Insert the appointment
      const [result] = await db.execute(
        'INSERT INTO appointments (name, phone, date, time, reason, status, prescription_file) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, phone, date, time, reason || null, status, prescription_file]
      );

      res.status(201).json({
        message: 'Appointment created successfully',
        id: result.insertId,
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Error creating appointment' });
    }
  },

  // Get all appointments
  getAll: async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT id, name, phone, 
               DATE_FORMAT(date, '%Y-%m-%d') as date, 
               TIME_FORMAT(time, '%H:%i') as time, 
               reason, status, prescription_file, 
               created_at, updated_at 
        FROM appointments 
        ORDER BY date, time
      `);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments' });
    }
  },

  // Get appointment by ID
  getById: async (req, res) => {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM appointments WHERE id = ?',
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({ message: 'Error fetching appointment' });
    }
  },

  // Update appointment
  update: async (req, res) => {
    try {
      const { name, phone, date, time, reason, status } = req.body;
      const prescription_file = req.file ? req.file.filename : undefined;

      // Validate required fields
      if (!name || !phone || !date || !time) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }

      let query = 'UPDATE appointments SET name = ?, phone = ?, date = ?, time = ?, reason = ?';
      let params = [name, phone, date, time, reason || null];

      if (status) {
        query += ', status = ?';
        params.push(status);
      }

      if (prescription_file) {
        query += ', prescription_file = ?';
        params.push(prescription_file);
      }

      query += ' WHERE id = ?';
      params.push(req.params.id);

      const [result] = await db.execute(query, params);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json({ message: 'Appointment updated successfully' });
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Error updating appointment' });
    }
  },

  // Cancel appointment
  cancel: async (req, res) => {
    try {
      const [result] = await db.execute(
        'UPDATE appointments SET status = ? WHERE id = ?',
        ['cancelled', req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({ message: 'Error cancelling appointment' });
    }
  },

  // Delete appointment
  delete: async (req, res) => {
    try {
      const [result] = await db.execute(
        'DELETE FROM appointments WHERE id = ?',
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ message: 'Error deleting appointment' });
    }
  },
};

module.exports = appointmentController;
