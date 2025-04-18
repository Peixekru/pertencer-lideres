import { comparePassword } from '../utils/cryptService.js';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  updateRefreshToken,
  clearRefreshToken
} from '../utils/tokenService.js';

import { findUserByLogin, findUserByIdAndToken } from '../services/findUserService.js';

// Login
export const login = async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await findUserByLogin(login);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await updateRefreshToken(user.id, refreshToken);

    // Setar refresh token como httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // só HTTPS em produção
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    res.json({
      message: 'Login bem-sucedido',
      user: { id: user.id, login: user.login },
      token: accessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};


// Refresh Token
export const refreshToken = async (req, res) => {
  // Obtém o refresh token dos cookies
  const refreshToken = req.cookies?.refreshToken;

  // Se não houver token, retorna erro de autenticação
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token é obrigatório' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = verifyRefreshToken(refreshToken);

    // Busca o usuário pelo ID e pelo token
    const user = await findUserByIdAndToken(decoded.id, refreshToken);

    // Se não encontrar o usuário ou o token não for válido, retorna erro
    if (!user) {
      return res.status(403).json({ message: 'Refresh token inválido' });
    }

    // Gera novo access token e novo refresh token
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // Atualiza o refresh token do usuário no banco de dados
    await updateRefreshToken(user.id, newRefreshToken);

    // Define o novo cookie com o refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Só envia via HTTPS em produção
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    // Retorna o novo access token e os dados do usuário
    res.json({
      token: newAccessToken,
      user: {
        id: user.id,
        login: user.login,
        // Adicione outros campos que quiser expor ao frontend, ex: name, role, email etc.
      }
    });
  } catch (error) {
    // Caso o token seja inválido ou expirado
    res.status(403).json({ message: 'Refresh token expirado ou inválido' });
  }
};



// Logout
export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token é obrigatório' });
  }

  try {
    await clearRefreshToken(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};