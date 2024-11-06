import { X, Globe, AppWindow, MessageCircle, Briefcase, Code, Database } from 'lucide-react';
import type { AppIcon } from '../types';

const marketplaceApps: AppIcon[] = [
  { id: 'ecommerce', title: 'E-commerce Builder', category: 'sites', icon: Briefcase },
  { id: 'portfolio', title: 'Portfolio Builder', category: 'sites', icon: Globe },
  { id: 'mobile', title: 'Mobile App Builder', category: 'apps', icon: AppWindow },
  { id: 'web', title: 'Web App Builder', category: 'apps', icon: Code },
  { id: 'ai-chat', title: 'AI Chat Builder', category: 'ai', icon: MessageCircle },
  { id: 'ai-db', title: 'AI Database', category: 'ai', icon: Database },
];

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (app: AppIcon) => void;
  usedApps: Set<string>;
}

export function MarketplaceModal({ isOpen, onClose, onAddApp, usedApps }: MarketplaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="popup-gradient backdrop-blur-xl rounded-xl w-[800px] max-h-[80vh] overflow-hidden border border-white/10 shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-light tracking-wide text-white">Marketplace</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-6">
            {marketplaceApps.map((app) => {
              const isUsed = usedApps.has(app.id);
              return (
                <button
                  key={app.id}
                  onClick={() => !isUsed && onAddApp(app)}
                  className={`aspect-square bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center transition-all border border-white/10
                    ${isUsed ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/20 cursor-pointer'}`}
                >
                  <div className="w-16 h-16 bg-white/10 rounded-xl mb-3 p-3 flex items-center justify-center">
                    {app.icon && <app.icon className="w-10 h-10 text-white" />}
                  </div>
                  <span className="text-white text-sm font-light tracking-wide">{app.title}</span>
                  <span className="text-white/60 text-xs mt-1">
                    {isUsed ? 'Already added' : app.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}