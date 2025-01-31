
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './pages/auth/authForm';
import Home from './pages/home/home';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/auth" element={<AuthForm/>} />
      </Routes>
    </Router>
  );
}

export default App;
