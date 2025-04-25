import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { mediaService } from "@/services/mediaService";
import { MediaResponseDto } from "@/types/media";

interface MediaHistoryContextType {
  historyItems: MediaResponseDto[];
  isLoading: boolean;
  fetchHistory: () => Promise<void>;
  lastFetched: Date | null;
  refreshAfterGeneration: (newItem?: MediaResponseDto) => void;
}

const MediaHistoryContext = createContext<MediaHistoryContextType>({
  historyItems: [],
  isLoading: false,
  fetchHistory: async () => {},
  lastFetched: null,
  refreshAfterGeneration: () => {},
});

export function useMediaHistory() {
  return useContext(MediaHistoryContext);
}

interface MediaHistoryProviderProps {
  children: ReactNode;
}

export function MediaHistoryProvider({ children }: MediaHistoryProviderProps) {
  const [historyItems, setHistoryItems] = useState<MediaResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const result = await mediaService.getMediaHistory({ page: 1, limit: 20 });
      setHistoryItems(result.data || []);
      setLastFetched(new Date());
    } catch (error) {
      console.error("Failed to fetch media history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh history after a new media item is created
  // Optionally takes the new item to add it to the current list immediately
  const refreshAfterGeneration = (newItem?: MediaResponseDto) => {
    if (newItem) {
      // Update the local state immediately with the new item
      setHistoryItems((prev) => [newItem, ...prev].slice(0, 20));
    }

    // Also fetch the latest data from the server
    fetchHistory();
  };

  // Prefetch data when the component mounts
  useEffect(() => {
    fetchHistory();
  }, []);

  const value = {
    historyItems,
    isLoading,
    fetchHistory,
    lastFetched,
    refreshAfterGeneration,
  };

  return (
    <MediaHistoryContext.Provider value={value}>
      {children}
    </MediaHistoryContext.Provider>
  );
}
