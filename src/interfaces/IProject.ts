export interface IProject {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  createdById: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectCreateDTO {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  createdById: number;
}

export interface IProjectUpdateDTO {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}