import { Request, Response } from "express";
import TaskRepositories from "../repositories/Task.Repositories";

class TasksController {
    getTasks (request: Request, response: Response) {
        TaskRepositories.FindAllTasks(request, response);
    }
}

export default new TasksController();