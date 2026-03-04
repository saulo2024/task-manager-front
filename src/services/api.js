import axios from 'axios';

const api = axios.create({
  // Use a sua URL da Koyeb que configuramos na Vercel
  baseURL: import.meta.env.VITE_API_URL, 
});

// INTERCEPTOR DE RESPOSTA: O vigia da expiração
api.interceptors.response.use(
  (response) => {
    // Se a resposta for sucesso (200, 201), apenas retorna os dados
    return response;
  },
  (error) => {
    // Se o erro for 401 (Não autorizado), significa que o token expirou ou é inválido
    if (error.response && error.response.status === 401) {
      console.warn("Sessão expirada. Redirecionando para o login...");
      
      // 1. Limpa o token do navegador para não tentar usar de novo
      localStorage.removeItem('token'); 
      localStorage.removeItem('user');

      // 2. Manda o usuário de volta para a tela de login
      window.location.href = '/'; 
    }

    return Promise.reject(error);
  }
);

export default api;