import { Request, Response } from "express";

class TaskRepositories {
    FindAllTasks (request: Request, response: Response) {
        response.status(200).json({ message: "FUNCIONOU CARA!!" })
    }
}


export default new TaskRepositories();