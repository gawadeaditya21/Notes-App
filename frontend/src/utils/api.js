import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
    const storedUser = localStorage.getItem('user');

    if(storedUser) {
        const {token} = JSON.parse(storedUser);
        req.headers.Authorization = `Bearer ${token}`; 
    }
    return req;
});

export default API;