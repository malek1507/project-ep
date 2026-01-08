import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import logo from './logo.png';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await axios.post('http://localhost:8080/auth/login', formData);

            document.cookie = `token=${response.data.token}; path=/; max-age=86400; SameSite=Lax`;

            setMessage('Login successful! Redirecting...');

            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (error) {
            setIsError(true);
            const errorMessage = error.response?.data?.message || 'Login failed. Invalid credentials or server error.';
            setMessage(errorMessage);
        }
    };

    return (
        <div className="login-container">
            <div style={{
                position: 'absolute',
                top: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center'
            }}>
                <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }} />
                <h1 style={{ marginTop: '10px' }}>WELCOME TO ETODO</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Login</button>
                <p>
                    Don't have an account?
                    <Link to="/register" className="link">
                        Register here
                    </Link>
                </p>
            </form>

            {message && (
                <p style={{
                    color: isError ? 'red' : 'green',
                    fontWeight: 'bold',
                    marginTop: '10px'
                }}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default Login;
