import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import TodoList from './TodoList';
import '../styles/Dashboard.css';
import logo from './logo.png';

function Dashboard() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);

    const getToken = () => {
        const match = document.cookie.match(/(?:^| )token=([^;]+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                document.cookie = 'token=; path=/; max-age=0';
                navigate('/login');
            }
        };

        fetchProfile();
    }, [navigate]);

    const displayUserName = user
        ? `${user.firstname || ''} ${user.name || ''}`.trim()
        : 'User';

    const getThemeIcon = () => {
        if (theme === 'light') return '☀️';
        if (theme === 'dark') return '🌙';
        return '👓';
    };

    const handleDeleteProfile = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your profile?');
        if (!confirmDelete) return;

        const token = getToken();
        try {
            await axios.delete('http://localhost:8080/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            document.cookie = 'token=; path=/; max-age=0';
            navigate('/login');
        } catch (error) { }
    };

    return (
        <div className={`dashboard ${theme}`}>
            <nav>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
                    Welcome, {displayUserName}!
                </h1>
                <div>
                    <button onClick={toggleTheme}>{getThemeIcon()}</button>
                    <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
                    <button onClick={handleDeleteProfile}>Delete Profile</button>
                    <button onClick={() => {
                        document.cookie = 'token=; path=/; max-age=0';
                        navigate('/login');
                    }}>Logout</button>
                </div>
            </nav>
            {user ? (
                <TodoList userId={user.id} />
            ) : (
                <p>Loading your tasks...</p>
            )}
        </div>
    );
}

export default Dashboard;
