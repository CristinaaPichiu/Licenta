import { Job } from "./job.model"; // Asigură-te că ai importat clasa Job

export class Column {
    constructor(public name: string, public jobs: Job[] = []) {}
}
