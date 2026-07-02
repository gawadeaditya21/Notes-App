import {useState, useContext} from "react";
import {useNavigate, Link} from 'react-router-dom';
import API from '../../utils/api.js';
import {AuthContext} from '../../context/AuthContext.jsx' 

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
            navigate('/');
        } catch(error) {
            setError(error.response?.data?.message || 'Login failed')
        }
    }


    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Login to Your Notes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" name="email" placeholder="Email" required
                    value={formData.email} onChange={handleChange}
                />
                <input 
                    type="password" name="password" placeholder="Password" required
                    value={formData.password} onChange={handleChange}
                />
                <button type="submit">Login</button>
            </form>
            
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}

export default Login;
