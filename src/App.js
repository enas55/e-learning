
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './pages/auth/authForm';
import Home from './pages/home/home';
import AllCourses from './pages/allCourses';
import CourseDetails from './pages/courseDetails';
import Favorite from './pages/favorite';
import Layout from './layout';
import UserDashboard from './pages/userDashboard';
import AdminDashboard from './pages/adminDashboard';
import AddCourse from './pages/addCourses';
import EditCourse from './pages/editCourse';
import Users from './pages/users';

function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="all-courses" element={<AllCourses />} />
                    <Route path="course_details/:courseId" element={<CourseDetails />} />
                    <Route path="favorite" element={<Favorite />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/add-course" element={<AddCourse />} />
                    <Route path="/edit-course" element={<EditCourse />} />
                    <Route path="/users" element={<Users/>} />
                </Route>
                <Route path="/auth" element={<AuthForm />} />
            </Routes>
        </Router>
  );
}

export default App;
