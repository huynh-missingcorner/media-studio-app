export interface Project {
  id: string;
  name: string;
  description: string;
  googleProjectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  googleProjectId?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  googleProjectId?: string;
}
