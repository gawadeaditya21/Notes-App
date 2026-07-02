import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../utils/api';
import { useTheme } from '../../context/ThemeContext.jsx';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, BookOpen, Moon, Sun } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            toast.success('Account created! Please log in.');
            navigate('/login', { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
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
                    <p>Join thousands organizing their thoughts with beautifully formatted notes.</p>
                </div>

                <div className="auth-features">
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Free to get started — no credit card
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Rich text: bold, lists, links &amp; more
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Dark &amp; light mode support
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Notes synced securely to the cloud
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
                                <UserPlus size={36} />
                            </div>
                            <h2>Create Account</h2>
                            <p>Set up your free NoteFlow account</p>
                        </div>

                        {/* Register form */}
                        <form
                            id="register-form"
                            onSubmit={handleSubmit}
                            className="auth-form"
                            aria-label="Registration form"
                        >
                            {/* Full Name */}
                            <div className="form-group">
                                <label htmlFor="register-name" className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <User size={16} className="input-icon" />
                                    <input
                                        id="register-name"
                                        type="text"
                                        name="name"
                                        placeholder="Jane Doe"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="register-email" className="form-label">Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={16} className="input-icon" />
                                    <input
                                        id="register-email"
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
                                <label htmlFor="register-password" className="form-label">Password</label>
                                <div className="input-wrapper">
                                    <Lock size={16} className="input-icon" />
                                    <input
                                        id="register-password"
                                        type="password"
                                        name="password"
                                        placeholder="Min. 6 characters"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <button
                                id="register-submit"
                                type="submit"
                                className="btn btn-primary"
                                style={{ marginTop: '0.5rem' }}
                            >
                                <UserPlus size={16} /> Create Account
                            </button>
                        </form>

                        <p className="auth-footer">
                            Already have an account?{' '}
                            <Link to="/login">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
