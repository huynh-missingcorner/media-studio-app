import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { projectService } from "@/services/api/projectService";
import { CreateProjectDto, UpdateProjectDto } from "@/types/project.types";

// Mock axios
vi.mock("axios");

describe("projectService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getProjects", () => {
    it("should fetch all projects successfully", async () => {
      // Arrange
      const mockProjects = [
        {
          id: "project1",
          name: "Project 1",
          description: "Test project 1",
          googleProjectId: "google-project-1",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
        {
          id: "project2",
          name: "Project 2",
          description: "Test project 2",
          googleProjectId: "google-project-2",
          createdAt: "2023-01-02T00:00:00.000Z",
          updatedAt: "2023-01-02T00:00:00.000Z",
        },
      ];

      const mockResponse = {
        data: mockProjects,
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await projectService.getProjects();

      // Assert
      expect(axios.get).toHaveBeenCalledWith("/api/api/projects");
      expect(result).toEqual(mockProjects);
    });
  });

  describe("getProjectById", () => {
    it("should fetch a specific project by ID", async () => {
      // Arrange
      const projectId = "project1";
      const mockProject = {
        id: projectId,
        name: "Project 1",
        description: "Test project 1",
        googleProjectId: "google-project-1",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
      };

      const mockResponse = {
        data: mockProject,
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await projectService.getProjectById(projectId);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(`/api/api/projects/${projectId}`);
      expect(result).toEqual(mockProject);
    });

    it("should throw an error when project is not found", async () => {
      // Arrange
      const projectId = "nonexistent";
      const mockError = new Error("Project not found");
      // Set properties directly on the Error object to simulate what axios produces
      mockError.name = "AxiosError";
      (mockError as AxiosError).response = {
        status: 404,
        statusText: "Not Found",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        data: {
          message: "Project not found",
        },
      };

      vi.mocked(axios.get).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(projectService.getProjectById(projectId)).rejects.toThrow(
        "Project not found"
      );
    });
  });

  describe("createProject", () => {
    it("should create a new project successfully", async () => {
      // Arrange
      const projectData: CreateProjectDto = {
        name: "New Project",
        description: "A new test project",
        googleProjectId: "google-project-new",
      };

      const mockProject = {
        id: "new-project",
        ...projectData,
        createdAt: "2023-01-03T00:00:00.000Z",
        updatedAt: "2023-01-03T00:00:00.000Z",
      };

      const mockResponse = {
        data: mockProject,
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await projectService.createProject(projectData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith("/api/api/projects", projectData);
      expect(result).toEqual(mockProject);
    });
  });

  describe("updateProject", () => {
    it("should update a project successfully", async () => {
      // Arrange
      const projectId = "project1";
      const updateData: UpdateProjectDto = {
        name: "Updated Project",
        description: "Updated description",
      };

      const mockProject = {
        id: projectId,
        name: "Updated Project",
        description: "Updated description",
        googleProjectId: "google-project-1",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-04T00:00:00.000Z",
      };

      const mockResponse = {
        data: mockProject,
      };

      vi.mocked(axios.patch).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await projectService.updateProject(projectId, updateData);

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        `/api/api/projects/${projectId}`,
        updateData
      );
      expect(result).toEqual(mockProject);
    });
  });

  describe("deleteProject", () => {
    it("should delete a project successfully", async () => {
      // Arrange
      const projectId = "project1";
      const mockResponse = {
        data: { success: true },
      };

      vi.mocked(axios.delete).mockResolvedValueOnce(mockResponse);

      // Act
      await projectService.deleteProject(projectId);

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(
        `/api/api/projects/${projectId}`
      );
    });
  });
});
