import {useState, useContext} from "react";
import {useNavigate, Link} from 'react-router-dom';
import API from '../../utils/api.js';
import {AuthContext} from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: ''});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError(null);

        try{
            const res = await API.post('/auth/login', formData);
            login(res.data);
            toast.success('Welcome back!');
            navigate('/');
        } catch(error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    }


    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
            <div className="card animate-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                    <LogIn size={40} />
                </div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Welcome Back</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        Login
                    </button>
                </form>
                
                <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
