export interface EducationInput {
  institution: string;
  title: string;
  startDate: string;
  endDate?: string;
}

export interface WorkExperienceInput {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface ResumeInput {
  filePath: string;
  fileType: string;
}

export interface CandidateInput {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: EducationInput[];
  workExperiences?: WorkExperienceInput[];
  cv?: ResumeInput;
}
