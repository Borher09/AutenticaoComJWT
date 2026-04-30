import express from "express";
import {
  login,
  refresh,
  logout,
} from "../controllers/authController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// rota protegida
router.get("/usuarios", authenticateToken, (req, res) => {
  res.json({ message: "Usuário autenticado", user: req.user });
});

// rota só admin
router.get(
  "/admin",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({ message: "Área do admin" });
  }
);

export default router;


//  ele "anexa" os dados do usuário à requisição (req.user) e deixa o código seguir.