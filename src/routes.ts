import { Router } from "express";
import TasksController from "./controllers/Tasks.Controller";

const router = Router();

router.get("/tasks", TasksController.getTasks);

export default router;