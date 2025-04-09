import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    comparePassword
} from '../services/authService.js';

import {
    findUserByLogin,
    findUserByIdAndToken,
    updateRefreshToken,
    clearRefreshToken
} from '../services/usersService.js';

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

        res.json({
            message: 'Login bem-sucedido',
            user: { id: user.id, login: user.login },
            token: accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Refresh Token
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token é obrigatório' });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await findUserByIdAndToken(decoded.id, refreshToken);

        if (!user) {
            return res.status(403).json({ message: 'Refresh token inválido' });
        }

        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        await updateRefreshToken(user.id, newRefreshToken);

        res.json({ token: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(403).json({ message: 'Refresh token expirado ou inválido' });
    }
};

// Logout
export const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token é obrigatório' });
    }

    try {
        await clearRefreshToken(refreshToken);
        res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};