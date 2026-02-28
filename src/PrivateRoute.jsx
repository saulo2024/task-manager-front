import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Verificamos se a "chave" (token) está no bolso (localStorage)
  const token = localStorage.getItem('token');
  
  // Se não tiver token, manda de volta para o Login
  if (!token) {
    return <Navigate to="/" />;
  }

  // Se tiver token, deixa entrar no Dashboard
  return children;
};

export default PrivateRoute;