
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './pages/auth/authForm';
import Home from './pages/home/home';
import AllCourses from './pages/allCourses';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/auth" element={<AuthForm/>} />
      <Route path="/all-courses" element={<AllCourses/>} />
      </Routes>
    </Router>
  );
}

export default App;
