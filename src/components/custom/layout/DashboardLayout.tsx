import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserProfileDialog } from "@/components/custom/profile/UserProfileDialog";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { History, Home, Settings } from "lucide-react";
import { MediaType } from "@/pages/app/dashboard-page";
import { useLocation, useNavigate } from "react-router-dom";
import { HistoryModal } from "@/components/custom/media/history/HistoryModal";
import { Logo } from "@/components/custom/icons/logo";
import { ProjectSelector } from "../projects/ProjectSelector";
import { SettingsSidebar } from "../media/chat/SettingsSidebar";
import { useMediaHistoryStore } from "@/stores";

// Create a context to share the active media type
interface DashboardContextType {
  activeMediaType: MediaType;
  setActiveMediaType: (type: MediaType) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  activeMediaType: "image",
  setActiveMediaType: () => {},
  settingsOpen: false,
  setSettingsOpen: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeMediaType, setActiveMediaType] = useState<MediaType>("image");
  const { setPage } = useMediaHistoryStore();
  const navigate = useNavigate();
  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  const contextValue = {
    activeMediaType,
    setActiveMediaType,
    settingsOpen,
    setSettingsOpen,
  };

  const handleSettingsToggle = () => {
    setSettingsOpen((prev) => !prev);
  };

  const isGenerationPage = useLocation().pathname.includes("generate");

  useEffect(() => {
    if (isGenerationPage) {
      setSettingsOpen(true);
    }
  }, [isGenerationPage]);

  const handleHistoryOpen = () => {
    setIsHistoryOpen(true);
    setPage(1);
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border py-2 px-4 z-30">
          <div className="mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Logo className="h-12 w-auto" />
              </div>
              <nav className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[16px] font-normal cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  <Home strokeWidth={2} className="w-5 h-5" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[16px] font-normal cursor-pointer"
                  onClick={handleHistoryOpen}
                >
                  <History strokeWidth={2} className="w-5 h-5" />
                  History
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-6">
              <ProjectSelector />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="relative flex h-[calc(100vh-65px)] overflow-hidden">
          <main
            className={cn(
              settingsOpen ? "w-[calc(100%-320px)]" : "w-full",
              "transition-all duration-300"
            )}
          >
            <div className="mx-auto h-full">{children}</div>
          </main>

          <aside
            className={cn(
              "absolute top-0 right-0 h-full w-[320px] border-l border-border bg-background shadow-lg transition-transform duration-300 z-20",
              settingsOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <SettingsSidebar onClose={handleSettingsToggle} />
          </aside>
        </div>

        {isGenerationPage && (
          <Button
            className={cn(
              "fixed top-[70px] right-4 z-30 rounded-full w-10 h-10 p-0 [&_svg]:size-5 transition-all ",
              settingsOpen && "opacity-0 pointer-events-none"
            )}
            onClick={handleSettingsToggle}
            variant="ghost"
            title={settingsOpen ? "Hide Settings" : "Show Settings"}
          >
            <Settings className="h-5 w-5 group-hover:text-blue-500" />
          </Button>
        )}

        <UserProfileDialog
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
        />

        <HistoryModal open={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
      </div>
    </DashboardContext.Provider>
  );
}
