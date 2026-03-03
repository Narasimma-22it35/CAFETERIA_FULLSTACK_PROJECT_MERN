import axios from 'axios';

const API_URL = 'http://localhost:5000/api/restaurants';

export const getRestaurants = () => axios.get(API_URL);

export const getRestaurantDetails = (id) => axios.get(`${API_URL}/${id}`);

export const updateCrowdStatus = (id, data) => axios.patch(`${API_URL}/${id}/crowd`, data);

export const updateMenuItem = (id, itemId, data) => axios.patch(`${API_URL}/${id}/menu/${itemId}`, data);

export const bulkUpdateStock = (id, data) => axios.post(`${API_URL}/${id}/menu/bulk`, data);
