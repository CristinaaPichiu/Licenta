// models/timeline-event.model.ts
export class TimelineEvent {
    constructor(
      public id: string,
      public date: Date,
      public time: string,
      public description: string,
      public location: string,
      public notes: string,
      public completed: boolean,
      public jobId: string 
    ) {}
  }
  