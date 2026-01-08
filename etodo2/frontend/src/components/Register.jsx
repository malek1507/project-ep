import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';
import logo from './logo.png';

const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
};

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        firstname: ''
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
            const response = await axios.post('http://localhost:8080/auth/register', formData);

            setMessage(response.data.message || 'Registration successful! Redirecting...');

            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            console.error('Registration failed:', error.response || error);
            setIsError(true);

            const errorMessage = error.response?.data?.message || 'Registration failed. Check server status.';
            setMessage(errorMessage);
        }
    };

    return (
        <div className="register-container">
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px'
            }}>
                <img src={logo} alt="Logo" style={{ width: '80px', height: '80px' }} />
            </div>

            <form onSubmit={handleSubmit}>
                <h2>Register</h2>

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

                <input
                    type="text"
                    name="name"
                    placeholder="Last Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                />

                <button type="submit">Register</button>

                <p>
                    Already have an account?
                    <span onClick={() => navigate('/login')} className="link">
                        Login here
                    </span>
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

export default Register;
