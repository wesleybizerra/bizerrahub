import { Router, type IRouter } from "express";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "leonidahub_salt_2026").digest("hex");
}

function makeToken(userId: number): string {
  return createHash("sha256").update(`${userId}-${Date.now()}-leonida`).digest("hex");
}

// In-memory session store (production would use Redis/DB sessions)
const sessions = new Map<string, number>();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
  if (!user) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const hash = hashPassword(password);
  if (user.passwordHash !== hash) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const token = makeToken(user.id);
  sessions.set(token, user.id);

  req.log.info({ userId: user.id, role: user.role }, "User logged in");

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
      badge: user.badge,
      xp: user.xp,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const userId = sessions.get(token);
  if (!userId) {
    res.status(401).json({ error: "Sessão inválida" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(401).json({ error: "Usuário não encontrado" });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: user.plan,
    badge: user.badge,
    xp: user.xp,
    createdAt: user.createdAt.toISOString(),
  });
});

export { sessions, hashPassword };
export default router;
