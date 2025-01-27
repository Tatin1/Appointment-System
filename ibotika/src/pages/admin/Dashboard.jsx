import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Edit2, Trash2, Plus } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEdit = (appointment) => {
    setCurrentAppointment(appointment);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:3000/api/appointments/${id}`);
        fetchAppointments(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:3000/api/appointments/${currentAppointment.id}`,
          Object.fromEntries(formData.entries())
        );
      } else {
        await axios.post(
          'http://localhost:3000/api/appointments',
          Object.fromEntries(formData.entries())
        );
      }
      setIsDialogOpen(false);
      setCurrentAppointment(null);
      setIsEditing(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  // Metric calculations
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
  const tomorrow = new Date(now.setDate(now.getDate() + 2)).toISOString().split('T')[0];

  const todayCount = appointments.filter((appt) => appt.date === today).length;
  const yesterdayCount = appointments.filter((appt) => appt.date === yesterday).length;
  const tomorrowCount = appointments.filter((appt) => appt.date === tomorrow).length;

  // Group appointments by day for line graphs
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyAppointments = appointments.filter((appt) => appt.date.startsWith(currentMonth));

  // Appointments by day
  const dailyCounts = monthlyAppointments.reduce((acc, appt) => {
    acc[appt.date] = (acc[appt.date] || 0) + 1;
    return acc;
  }, {});

  // Appointments by status
  const statusCounts = monthlyAppointments.reduce((acc, appt) => {
    const date = appt.date;
    const status = appt.status || "Unknown"; // Handle missing statuses
    if (!acc[status]) acc[status] = {};
    acc[status][date] = (acc[status][date] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = {
    labels: Object.keys(dailyCounts),
    datasets: Object.entries(statusCounts).map(([status, data]) => ({
      label: status,
      data: Object.keys(dailyCounts).map((date) => data[date] || 0),
      borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      backgroundColor: `hsla(${Math.random() * 360}, 70%, 50%, 0.3)`,
    })),
  };

  const appointmentsChartData = {
    labels: Object.keys(dailyCounts),
    datasets: [
      {
        label: 'Appointments this Month',
        data: Object.values(dailyCounts),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-3 bg-white shadow rounded-lg text-center flex-grow">
        <h2 className="text-md font-semibold">Appointments Yesterday</h2>
        <p className="text-2xl font-bold">{yesterdayCount}</p>
      </div>
      <div className="p-3 bg-white shadow rounded-lg text-center flex-grow">
        <h2 className="text-md font-semibold">Appointments Today</h2>
        <p className="text-2xl font-bold">{todayCount}</p>
      </div>
      <div className="p-3 bg-white shadow rounded-lg text-center flex-grow">
        <h2 className="text-md font-semibold">Appointments Tomorrow</h2>
        <p className="text-2xl font-bold">{tomorrowCount}</p>
  </div>

      </div>

      <div className="flex gap-6">
        {/* Table Section */}
        <div className="flex-grow">
          <div className="mb-6">
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentAppointment(null);
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Appointment
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.name}</TableCell>
                    <TableCell>{appointment.phone}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(appointment)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Line Charts */}
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Appointments Overview</h2>
          <Line data={appointmentsChartData} />
          <h2 className="text-xl font-bold mt-8 mb-4">Status Overview</h2>
          <Line data={statusChartData} />
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Appointment' : 'Add Appointment'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentAppointment?.name || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={currentAppointment?.phone || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={currentAppointment?.date || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  defaultValue={currentAppointment?.time || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  defaultValue={currentAppointment?.reason || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={currentAppointment?.status || ''}
                  className="border rounded-md p-2 w-full"
                  required
                >
                  <option value="" disabled>Select a status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
