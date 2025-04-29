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
import { Folder } from "lucide-react";
import { useEffect } from "react";
import { useMediaHistoryStore } from "@/stores/mediaHistoryStore";

export function ProjectSelector() {
  const {
    projects,
    currentProject,
    isLoading,
    setCurrentProject,
    fetchProjects,
  } = useProjectStore();
  const { setProjectFilter } = useMediaHistoryStore();

  // Load projects when component mounts
  useEffect(() => {
    fetchProjects()
      .then(() => {
        // When projects are loaded, also update the media history filter if there's a current project
        if (currentProject?.id) {
          setProjectFilter(currentProject.id);
        }
      })
      .catch((error) => {
        console.error("Failed to load projects:", error);
      });
  }, [fetchProjects, currentProject?.id, setProjectFilter]);

  const handleProjectSelect = (projectId: string) => {
    setCurrentProject(projectId);
    setProjectFilter(projectId);
  };

  return (
    <Select
      disabled={isLoading}
      value={currentProject?.id}
      onValueChange={handleProjectSelect}
    >
      <SelectTrigger className="w-[240px]">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4" />
          <SelectValue
            placeholder={isLoading ? "Loading projects..." : "Select project"}
          />
        </div>
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
