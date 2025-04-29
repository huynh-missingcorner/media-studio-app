import { create } from "zustand";
import { persist } from "zustand/middleware";
import { projectService } from "@/services/api/projectService";
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "@/types/project.types";

interface ProjectState {
  // State
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchProjects: () => Promise<Project[]>;
  refreshIfNeeded: () => Promise<Project[] | undefined>;
  setCurrentProject: (id: string) => void;
  createProject: (data: CreateProjectDto) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectDto) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

// 5 minutes refresh interval (in milliseconds)
const REFRESH_INTERVAL = 5 * 60 * 1000;

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,
      lastFetched: null,

      // Fetch projects from API
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const projects = await projectService.getProjects();
          const currentProjectId = get().currentProject?.id;

          set({
            projects,
            // If there's a current project, keep it selected if it's still in the list
            // Otherwise, select the first project if available
            currentProject: currentProjectId
              ? projects.find((p) => p.id === currentProjectId) ||
                (projects.length > 0 ? projects[0] : null)
              : projects.length > 0
              ? projects[0]
              : null,
            isLoading: false,
            lastFetched: Date.now(),
          });

          // Only set current project if we have projects
          if (projects.length > 0 && !currentProjectId) {
            const projectIdToSelect = currentProjectId || projects[0].id;
            if (projectIdToSelect) {
              get().setCurrentProject(projectIdToSelect);
            }
          }

          return projects;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch projects",
            isLoading: false,
          });
          throw error;
        }
      },

      // Refresh projects if the data is stale
      refreshIfNeeded: async () => {
        const { lastFetched } = get();
        const now = Date.now();

        // Refresh if never fetched or data is older than the refresh interval
        if (!lastFetched || now - lastFetched > REFRESH_INTERVAL) {
          return get().fetchProjects();
        }
      },

      // Set the current project
      setCurrentProject: (id: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id);
        if (project) {
          set({ currentProject: project });
        }
      },

      // Create a new project
      createProject: async (data: CreateProjectDto) => {
        set({ isLoading: true, error: null });
        try {
          const newProject = await projectService.createProject(data);
          set((state) => ({
            projects: [...state.projects, newProject],
            currentProject: newProject,
            isLoading: false,
            lastFetched: Date.now(),
          }));
          return newProject;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to create project",
            isLoading: false,
          });
          throw error;
        }
      },

      // Update an existing project
      updateProject: async (id: string, data: UpdateProjectDto) => {
        set({ isLoading: true, error: null });
        try {
          const updatedProject = await projectService.updateProject(id, data);
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? updatedProject : p
            ),
            currentProject:
              state.currentProject?.id === id
                ? updatedProject
                : state.currentProject,
            isLoading: false,
            lastFetched: Date.now(),
          }));
          return updatedProject;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update project",
            isLoading: false,
          });
          throw error;
        }
      },

      // Delete a project
      deleteProject: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await projectService.deleteProject(id);
          set((state) => {
            const updatedProjects = state.projects.filter((p) => p.id !== id);
            return {
              projects: updatedProjects,
              // If the deleted project was the current project, select a new one
              currentProject:
                state.currentProject?.id === id
                  ? updatedProjects.length > 0
                    ? updatedProjects[0]
                    : null
                  : state.currentProject,
              isLoading: false,
              lastFetched: Date.now(),
            };
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete project",
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "project-storage",
      // Only persist specific parts of the state
      partialize: (state) => ({
        projects: state.projects,
        currentProject: state.currentProject,
      }),
    }
  )
);
