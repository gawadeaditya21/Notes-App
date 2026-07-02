import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../utils/api.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, BookOpen, Moon, Sun } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            login(res.data);
            toast.success('Welcome back!');
            navigate('/', { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-page">
            {/* ── Left Decorative Panel ── */}
            <div className="auth-panel-left">
                <div className="auth-branding">
                    <div className="auth-logo-icon">
                        <BookOpen size={36} />
                    </div>
                    <h1>NoteFlow</h1>
                    <p>Your thoughts, beautifully organized. Capture ideas with rich formatting.</p>
                </div>

                <div className="auth-features">
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Rich text editor with formatting
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Dark &amp; light mode support
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Secure, cloud-synced notes
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Fully responsive on all devices
                    </div>
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="auth-panel-right">
                {/* Theme toggle */}
                <button
                    className="theme-toggle auth-theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    style={{
                        background: 'var(--accent-muted)',
                        border: '1.5px solid var(--border-2)',
                    }}
                >
                    <span className="theme-toggle-thumb">
                        {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                    </span>
                </button>

                <div className="auth-form-card animate-slide-right">
                    <div className="card card-body">
                        {/* Form header */}
                        <div className="auth-form-header">
                            <div className="auth-form-icon">
                                <LogIn size={36} />
                            </div>
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue to your notes</p>
                        </div>

                        {/* Login form */}
                        <form
                            id="login-form"
                            onSubmit={handleSubmit}
                            className="auth-form"
                            aria-label="Login form"
                        >
                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="login-email" className="form-label">Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={16} className="input-icon" />
                                    <input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label htmlFor="login-password" className="form-label">Password</label>
                                <div className="input-wrapper">
                                    <Lock size={16} className="input-icon" />
                                    <input
                                        id="login-password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <button
                                id="login-submit"
                                type="submit"
                                className="btn btn-primary"
                                style={{ marginTop: '0.5rem' }}
                            >
                                <LogIn size={16} /> Sign In
                            </button>
                        </form>

                        <p className="auth-footer">
                            Don&apos;t have an account?{' '}
                            <Link to="/register">Create one here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
