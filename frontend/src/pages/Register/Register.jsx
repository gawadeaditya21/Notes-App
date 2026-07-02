import React, { useState } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import API from '../../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: ''});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError(null);

        try {
            await API.post('/auth/register', formData)
            navigate('/login');
        } catch(error) {
            setError(error.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Create an Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" name="name" placeholder="Name" required
                    value={formData.name} onChange={handleChange}
                />
                <input 
                    type="email" name="email" placeholder="Email" required
                    value={formData.email} onChange={handleChange}
                />
                <input 
                    type="password" name="password" placeholder="Password" required
                    value={formData.password} onChange={handleChange}
                />
                <button type="submit">Register</button>
            </form>
            
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
};

export default Register;
