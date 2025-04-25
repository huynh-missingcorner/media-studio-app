import { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectSelector() {
  const {
    projects,
    currentProject,
    isLoading,
    fetchProjects,
    refreshIfNeeded,
    setCurrentProject,
  } = useProjectStore();

  // Fetch projects on initial load
  useEffect(() => {
    fetchProjects();

    // Set up a refresh interval
    const intervalId = setInterval(() => {
      refreshIfNeeded();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchProjects, refreshIfNeeded]);

  const handleProjectSelect = (projectId: string) => {
    setCurrentProject(projectId);
  };

  return (
    <Select
      disabled={isLoading}
      value={currentProject?.id}
      onValueChange={handleProjectSelect}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue
          placeholder={isLoading ? "Loading projects..." : "Select project"}
        />
      </SelectTrigger>
      <SelectContent>
        {(!projects || projects.length === 0) && (
          <div className="py-2 px-2 text-sm text-muted-foreground">
            No projects found.
          </div>
        )}
        {projects && projects.length > 0 && (
          <SelectGroup>
            <SelectLabel className="text-[12px]">Projects</SelectLabel>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
