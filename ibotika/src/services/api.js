import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Appointment APIs
export const createAppointment = async (appointmentData) => {
  try {
    // Use FormData if there's a file upload
    let formData;
    if (appointmentData instanceof FormData) {
      formData = appointmentData;
    } else {
      formData = new FormData();
      Object.keys(appointmentData).forEach(key => {
        formData.append(key, appointmentData[key]);
      });
    }

    const response = await axios.post(`${API_BASE_URL}/appointments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating appointment');
  }
};

export const fetchAppointments = async () => {
  try {
    const response = await api.get('/appointments');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching appointments');
  }
};

export const getAppointmentById = async (id) => {
  try {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching appointment');
  }
};

export const updateAppointment = async (id, updateData) => {
  try {
    // Use FormData if there's a file upload
    let formData;
    if (updateData instanceof FormData) {
      formData = updateData;
    } else {
      formData = new FormData();
      Object.keys(updateData).forEach(key => {
        formData.append(key, updateData[key]);
      });
    }

    const response = await axios.put(`${API_BASE_URL}/appointments/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating appointment');
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting appointment');
  }
};

export const cancelAppointment = async (id) => {
  try {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error cancelling appointment');
  }
};