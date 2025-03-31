import { Router } from "express";

const router = Router();

router.get("tasks", () => console.log("opa"));

export default router;