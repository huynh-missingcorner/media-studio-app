import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaHistoryStore } from "@/stores";
import { useProjectStore } from "@/stores";
import { HistoryItem } from "./HistoryItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Filter } from "lucide-react";
import { MediaType } from "@/types/media.types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "../../layout/Badge";

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MEDIA_TYPE_OPTIONS = [
  { value: "IMAGE", label: "Image" },
  { value: "VIDEO", label: "Video" },
  { value: "AUDIO", label: "Audio" },
  { value: "MUSIC", label: "Music" },
];

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];

export function HistoryModal({ open, onOpenChange }: HistoryModalProps) {
  const {
    historyItems,
    isLoading,
    fetchHistory,
    lastFetched,
    currentPage,
    totalPages,
    itemsPerPage,
    filters,
    setPage,
    setItemsPerPage,
    setMediaTypeFilter,
    setProjectFilter,
    clearFilters,
  } = useMediaHistoryStore();

  const { projects, currentProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Load current project by default for the filter
  useEffect(() => {
    if (open && currentProject && !filters.projectId) {
      setProjectFilter(currentProject.id);
    }
  }, [open, currentProject, filters.projectId, setProjectFilter]);

  // Refresh data when the modal opens if data is stale (older than 1 minute)
  useEffect(() => {
    if (open) {
      const shouldRefresh =
        !lastFetched || new Date().getTime() - lastFetched.getTime() > 60000; // 1 minute

      if (shouldRefresh) {
        fetchHistory();
      }
    }
  }, [open, lastFetched, fetchHistory]);

  // Handle search
  const handleSearch = () => {
    useMediaHistoryStore.getState().setSearchFilter(searchTerm || null);
  };

  // Handle search on Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer pages than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first and last page
      pageNumbers.push(1);

      // Calculate start and end of page numbers to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const activeFiltersCount = [
    filters.mediaType,
    filters.projectId,
    filters.search,
  ].filter(Boolean).length;

  // Fix the types for the dropdown menu
  const handleMediaTypeChange = (value: string) => {
    if (value === "") {
      setMediaTypeFilter(null);
    } else {
      // Only set if it's a valid MediaType
      if (MEDIA_TYPE_OPTIONS.find((opt) => opt.value === value)) {
        // Explicitly cast to MediaType since we know it's valid
        setMediaTypeFilter(value as unknown as MediaType);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between h-[46px]">
          <DialogTitle className="text-2xl font-bold">History</DialogTitle>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder="Search by prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-9 w-[200px] md:w-[300px]"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Media Type Filter */}
                <DropdownMenuLabel className="text-xs mt-2">
                  Media Type
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={filters.mediaType || ""}
                  onValueChange={handleMediaTypeChange}
                >
                  <DropdownMenuRadioItem value="">
                    All Types
                  </DropdownMenuRadioItem>
                  {MEDIA_TYPE_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                {/* Project Filter */}
                <DropdownMenuLabel className="text-xs mt-2">
                  Project
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={filters.projectId || ""}
                  onValueChange={(value) => setProjectFilter(value || null)}
                >
                  <DropdownMenuRadioItem value="">
                    All Projects
                  </DropdownMenuRadioItem>
                  {projects.map((project) => (
                    <DropdownMenuRadioItem key={project.id} value={project.id}>
                      {project.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                {/* Results per page */}
                <DropdownMenuLabel className="text-xs mt-2">
                  Results per page
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={String(itemsPerPage)}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem key={option} value={String(option)}>
                      {option} items
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                {/* Clear filters button */}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  disabled={activeFiltersCount === 0}
                  onClick={() => clearFilters()}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pb-4">
            {filters.mediaType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type:{" "}
                {
                  MEDIA_TYPE_OPTIONS.find((o) => o.value === filters.mediaType)
                    ?.label
                }
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setMediaTypeFilter(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "
                {filters.search.length > 15
                  ? filters.search.substring(0, 15) + "..."
                  : filters.search}
                "
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => {
                    useMediaHistoryStore.getState().setSearchFilter(null);
                    setSearchTerm("");
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFiltersCount > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  clearFilters();
                  setSearchTerm("");
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
              {historyItems && historyItems.length > 0 ? (
                historyItems.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onOpenChange={onOpenChange}
                  />
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center h-64 text-muted-foreground">
                  No history items found
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, currentPage - 1))}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, idx) =>
                      typeof pageNum === "number" ? (
                        <PaginationItem key={idx}>
                          <PaginationLink
                            onClick={() => setPage(pageNum)}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage(Math.min(totalPages, currentPage + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
