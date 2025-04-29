import apiClient from "@/lib/api";
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "@/types/project.types";

/**
 * Service for handling project-related operations
 */
export const projectService = {
  /**
   * Get all projects for the authenticated user
   * @returns Array of projects
   */
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>("/api/projects");
    return response.data;
  },

  /**
   * Get project details by ID
   * @param id - Project ID
   * @returns Project details
   */
  async getProjectById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  /**
   * Create a new project
   * @param data - Project creation data
   * @returns Created project
   */
  async createProject(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post<Project>("/api/projects", data);
    return response.data;
  },

  /**
   * Update an existing project
   * @param id - Project ID
   * @param data - Project update data
   * @returns Updated project
   */
  async updateProject(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch<Project>(
      `/api/projects/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a project
   * @param id - Project ID
   */
  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/api/projects/${id}`);
  },
};
