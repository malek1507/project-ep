import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', firstname: '', email: '' });

    const getToken = () => {
        const match = document.cookie.match(/(?:^| )token=([^;]+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const token = getToken();
        axios.get('http://localhost:8080/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => setForm(res.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        try {
            await axios.put('http://localhost:8080/user/profile', form, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/dashboard');
        } catch (error) { }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
                <input
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    placeholder="First Name"
                />
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
            </form>
        </div>
    );
}

export default EditProfile;
