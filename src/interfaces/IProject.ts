import { Project, StatusEnum } from '@prisma/client'; // Importar StatusEnum

export interface IProject {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: StatusEnum;
  createdById: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectCreateDTO {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: StatusEnum;
  createdById: number;
}

export interface IProjectUpdateDTO {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: StatusEnum;
}

// Puedes mantener la interfaz base si la usas en algún lugar, aunque Project ya viene de Prisma
// export interface IProject extends Project {}