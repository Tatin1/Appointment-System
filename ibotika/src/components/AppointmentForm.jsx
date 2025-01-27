import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '10:00', // Default time
    reason: '',
    prescription: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bookedAppointments, setBookedAppointments] = useState([]);

  useEffect(() => {
    // Fetch existing appointments to avoid double booking
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/appointments');
        setBookedAppointments(response.data); // Assumes response contains an array of { date, time }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };
    fetchAppointments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      prescription: file,
    }));
  };

  const validateDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    const appointmentDate = new Date(date);

    if (appointmentDate < today) {
      return 'The appointment date cannot be in the past.';
    }
    if (appointmentDate > maxDate) {
      return 'The appointment date must be within the next 3 months.';
    }
    return null;
  };

  const isTimeBooked = (date, time) => {
    return bookedAppointments.some(
      (appointment) => appointment.date === date && appointment.time === time
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
  
    // Validate date
    const dateError = validateDate(formData.date);
    if (dateError) {
      setError(dateError);
      setIsSubmitting(false);
      return;
    }
  
    // Check for duplicate time slots on the selected day
    if (isTimeBooked(formData.date, formData.time)) {
      setError('This time slot is already booked. Please select a different time.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('reason', formData.reason);
      if (formData.prescription) {
        formDataToSend.append('prescription', formData.prescription);
      }
  
      // Submit the form data to the backend
      await axios.post('http://localhost:3000/api/appointments', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      // Success message and form reset
      setSuccessMessage('Appointment scheduled successfully!');
      setFormData({
        name: '',
        phone: '',
        date: '',
        time: '10:00',
        reason: '',
        prescription: null,
      });
  
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      setError(error.response?.data?.message || 'Error creating appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User size={16} />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar size={16} />
                Preferred Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full"
                min={new Date().toISOString().split("T")[0]} // Sets today's date as the minimum
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock size={16} />
                Preferred Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full"
                min={formData.date === new Date().toISOString().split('T')[0]
                  ? new Date().toTimeString().split(':').slice(0, 2).join(':') > "10:00"
                    ? new Date().toTimeString().split(':').slice(0, 2).join(':')
                    : "10:00"
                  : "10:00"} // Dynamically sets the minimum time to now or 10:00 AM
                max="18:00" // Sets the latest time to 6:00 PM
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Reason for Visit
            </Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              className="w-full"
              placeholder="Please describe the reason for your visit"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prescription" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Upload Prescription (if any)
            </Label>
            <Input
              id="prescription"
              name="prescription"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </span>
            ) : (
              'Schedule Appointment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
