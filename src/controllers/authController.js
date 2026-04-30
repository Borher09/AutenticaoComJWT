import jwt from "jsonwebtoken";
import env from "../config/env.js";

const users = [
  { id: 1, username: "admin", password: "123", role: "admin" },
  { id: 2, username: "user", password: "123", role: "usuario" },
  { id: 3, username: "mod", password: "123", role: "moderador" },
];

let refreshTokens = [];

export const login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const payload = { id: user.id, role: user.role };

  const accessToken = jwt.sign(payload, env.jwtSecret, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: "7d",
  });

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
};

export const refresh = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: "Token não enviado" });

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Refresh inválido" });
  }

  jwt.verify(token, env.jwtRefreshSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    refreshTokens = refreshTokens.filter((t) => t !== token);

    const payload = { id: user.id, role: user.role };

    const newAccessToken = jwt.sign(payload, env.jwtSecret, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(payload, env.jwtRefreshSecret, {
      expiresIn: "7d",
    });

    refreshTokens.push(newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
};

export const logout = (req, res) => {
  const { token } = req.body;

  refreshTokens = refreshTokens.filter((t) => t !== token);

  res.json({ message: "Logout realizado" });
};
