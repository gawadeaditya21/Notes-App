import React, { useState } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

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
            toast.success('Account created! Please log in.');
            navigate('/login');
        } catch(error) {
            toast.error(error.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
            <div className="card animate-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                    <UserPlus size={40} />
                </div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Create an Account</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" name="name" placeholder="Full Name" required
                            value={formData.name} onChange={handleChange}
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
                        <input 
                            type="email" name="email" placeholder="Email Address" required
                            value={formData.email} onChange={handleChange}
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
                        <input 
                            type="password" name="password" placeholder="Password" required
                            value={formData.password} onChange={handleChange}
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                        Register
                    </button>
                </form>
                
                <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
