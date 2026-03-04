import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './PrivateRoute'; // Verifique se o import está correto


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Login />} />

        {/* Use o nome exato que está no seu arquivo: PrivateRoute */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;