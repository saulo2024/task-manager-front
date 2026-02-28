import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/sign-in', { email, password });
      localStorage.setItem('token', response.data.data.token);
      alert('Login realizado com sucesso! 🎉');
      
      // Dica: use letra minúscula para bater com o seu App.jsx
      navigate('/dashboard'); 
    } catch (error) {
      alert('Erro ao fazer login: ' + error.response?.data?.message);
    } finally {
      // 1. ADICIONE ISSO: Garante que o botão volte ao normal mesmo se der erro
      setIsLoading(false); 
    }
  };

  return (
    <div className="container">
      <h2>Login - Pro Task Manager</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <br /><br />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <br /><br />
        
        {/* 2. MUDE O BOTÃO: Ele fica desabilitado e muda o texto durante o loading */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login;