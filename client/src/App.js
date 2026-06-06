import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GenerateQuiz from './pages/GenerateQuiz';
import QuizPage from './pages/QuizPage';
import Results from './pages/Results';
import Profile from './pages/Profile';
import PDFQuiz from './pages/PDFQuiz';
import AdminPanel from './pages/AdminPanel';
import AdminRegister from './pages/AdminRegister';
import JoinQuiz from './pages/JoinQuiz';
import TestResults from './pages/TestResults';
import MyTests from './pages/MyTests';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/"               element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/generate"       element={<PrivateRoute><GenerateQuiz /></PrivateRoute>} />
        <Route path="/quiz/:id"       element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        <Route path="/results"        element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path="/profile"        element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/pdf-quiz"       element={<PrivateRoute><PDFQuiz /></PrivateRoute>} />
        <Route path="/admin"          element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/join"          element={<PrivateRoute><JoinQuiz /></PrivateRoute>} />
<Route path="/join/:testId"  element={<PrivateRoute><JoinQuiz /></PrivateRoute>} />
<Route path="/test-results/:testId" element={<PrivateRoute><TestResults /></PrivateRoute>} />
        <Route path="/my-tests" element={<PrivateRoute><MyTests /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}