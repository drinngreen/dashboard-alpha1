import React, { useState, useCallback, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  Globe,
  AppWindow,
  MessageCircle,
  Trash2,
  Plus,
  Shield,
  Clock,
  Bell,
  Wifi,
  Battery,
  Volume2,
} from "lucide-react";
import { DraggableIcon } from "./components/DraggableIcon";
import { MarketplaceModal } from "./components/MarketplaceModal";
import { QuickAddModal } from "./components/QuickAddModal";
import { UninstallDialog } from "./components/UninstallDialog";
import type { AppIcon } from "./types";

// Configurazione per dispositivi touch
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const touchBackendOptions = {
  enableMouseEvents: true,
  enableTouchEvents: true,
  delayTouchStart: 50,
  delayMouseStart: 0,
  touchSlop: 20,
  ignoreContextMenu: true,
};

const initialIcons: AppIcon[] = [
  {
    id: "sitebuilder",
    title: "Site Builder",
    category: "builder",
    icon: Globe,
  },
  {
    id: "appbuilder",
    title: "App Builder",
    category: "builder",
    icon: AppWindow,
  },
  {
    id: "chatbuilder",
    title: "Chat Builder",
    category: "builder",
    icon: MessageCircle,
  },
];

function App() {
  const [icons, setIcons] = useState<AppIcon[]>(initialIcons);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [uninstallApp, setUninstallApp] = useState<AppIcon | null>(null);
  const [usedApps, setUsedApps] = useState<Set<string>>(new Set());
  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (id: string, x: number, y: number, targetId?: string) => {
      if (targetId === "trash") {
        const appToUninstall = icons.find((icon) => icon.id === id);
        if (appToUninstall) {
          setUninstallApp(appToUninstall);
        }
        return;
      }

      const rect = workspaceRef.current?.getBoundingClientRect();
      if (rect) {
        const newX = Math.max(0, Math.min(rect.width - 80, x - rect.left));
        const newY = Math.max(0, Math.min(rect.height - 120, y - rect.top));

        setIconPositions((prev) => ({
          ...prev,
          [id]: { x: newX, y: newY },
        }));
      }
    },
    [icons]
  );

  const handleConfirmUninstall = () => {
    if (uninstallApp) {
      const baseId = uninstallApp.id.split("-")[0];

      setIcons((prev) => prev.filter((icon) => icon.id !== uninstallApp.id));
      setIconPositions((prev) => {
        const newPositions = { ...prev };
        delete newPositions[uninstallApp.id];
        return newPositions;
      });

      setUsedApps((prev) => {
        const next = new Set(prev);
        next.delete(baseId);
        return next;
      });

      setUninstallApp(null);
    }
  };

  const handleAddApp = useCallback(
    (app: AppIcon) => {
      const baseId = app.id;
      if (!usedApps.has(baseId)) {
        const newId = `${app.id}-${Date.now()}`;
        const newApp = { ...app, id: newId };

        setIcons((prev) => [...prev, newApp]);
        setUsedApps((prev) => new Set(prev).add(baseId));

        const rect = workspaceRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = (rect.width - 80) / 2;
          const centerY = (rect.height - 120) / 2;
          setIconPositions((prev) => ({
            ...prev,
            [newId]: { x: centerX, y: centerY },
          }));
        }
      }
    },
    [usedApps]
  );

  return (
    <DndProvider
      backend={isTouchDevice ? TouchBackend : HTML5Backend}
      options={isTouchDevice ? touchBackendOptions : undefined}
    >
      <div className="min-h-screen workspace-gradient overflow-hidden relative">
        <div className="zoliqua-watermark">ZOLIQUA</div>

        <div className="absolute top-4 right-4 z-50">
          <DraggableIcon
            icon={{
              id: "trash",
              title: "Trash",
              category: "system",
              icon: Trash2,
            }}
            isTrash
            onDrop={handleDrop}
          />
        </div>

        <div ref={workspaceRef} className="absolute inset-0 p-8 pb-20" style={{ touchAction: "none" }}>
          {icons.map((icon) => (
            <DraggableIcon
              key={icon.id}
              icon={icon}
              position={iconPositions[icon.id]}
              onDrop={handleDrop}
            />
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 h-12 bg-[#0a1f1d] flex items-center justify-between px-3 shadow-xl z-50">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center space-x-1 px-2 py-1 hover:bg-[#132927] transition-colors rounded"
            >
              <Plus className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-xs">App</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <Wifi className="w-4 h-4 text-white/60" />
            <Battery className="w-4 h-4 text-white/60" />
          </div>
        </div>

        <MarketplaceModal
          isOpen={isMarketplaceOpen}
          onClose={() => setIsMarketplaceOpen(false)}
          onAddApp={handleAddApp}
          usedApps={usedApps}
        />

        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddApp={handleAddApp}
          usedApps={usedApps}
        />

        <UninstallDialog
          isOpen={!!uninstallApp}
          appTitle={uninstallApp?.title || ""}
          onClose={() => setUninstallApp(null)}
          onConfirm={handleConfirmUninstall}
        />
      </div>
    </DndProvider>
  );
}

export default App;
