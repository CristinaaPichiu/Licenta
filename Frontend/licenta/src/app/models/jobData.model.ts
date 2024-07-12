// Definirea unei interfețe pentru structura datelor jobului
export interface JobData {
    title?: string;
    company?: string;
    location?: string;
    snippet?: string;
    link?: string;
  }
  
  export class JobRecommendation {
    title: string;
    company: string;
    location: string;
    snippet: string;
    link: string;
  
    constructor(data: JobData) {
      this.title = data.title || 'No Title Provided';
      this.company = data.company || 'No Company Provided';
      this.location = data.location || 'No Location Provided';
      this.snippet = data.snippet || 'No Description Provided';
      this.link = data.link || '#';
    }
  }
  