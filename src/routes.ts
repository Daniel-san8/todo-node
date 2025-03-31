import { Router } from "express";
import TaskRepositories from "./repositories/Task.Repositories";

const router = Router();

router.get("tasks", TaskRepositories.FindAllTasks);

export default router;