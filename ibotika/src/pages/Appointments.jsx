import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { fetchAppointments, cancelAppointment } from '../services/api';


const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      await loadAppointments(); // Add await here
      fetchAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Appointments</h1>
      
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
          <CardHeader>
            <CardTitle>
              Appointment on {new Date(appointment.date).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {new Date(`1970-01-01T${appointment.time}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{appointment.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="font-medium">{appointment.reason}</p>
              </div>
              <div className="flex items-end justify-end">
                <Button variant="destructive" onClick={() => handleCancel(appointment.id)}>
                  Cancel Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        ))}

        {appointments.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No appointments found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Appointments;