// src/app/models/job.model.ts
export class Job {
    constructor(
      public id: string,
      public jobTitle: string,
      public company: string,
      public date: Date,
      public location: string,
      public salary: number,
      public jobType: string,
      public link: string,
      public notes: string
    ) {}
  }
  