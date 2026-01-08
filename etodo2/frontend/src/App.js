import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';   // ✅ import the new component
import './App.css';

function App() {
    return (
        <ThemeProvider>
            <div className="App">
                <Router>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/edit-profile" element={<EditProfile />} /> {/* ✅ new route */}
                    </Routes>
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
