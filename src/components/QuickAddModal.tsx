import { X, Code, Database, Server, Cloud, Terminal, GitBranch } from 'lucide-react';
import type { AppIcon } from '../types';

const quickAddApps: AppIcon[] = [
  { id: 'code-editor', title: 'Code Editor', category: 'dev', icon: Code },
  { id: 'database', title: 'Database', category: 'dev', icon: Database },
  { id: 'server', title: 'Server', category: 'dev', icon: Server },
  { id: 'cloud', title: 'Cloud Storage', category: 'dev', icon: Cloud },
  { id: 'terminal', title: 'Terminal', category: 'dev', icon: Terminal },
  { id: 'git', title: 'Git Manager', category: 'dev', icon: GitBranch },
];

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (app: AppIcon) => void;
  usedApps: Set<string>;
}

export function QuickAddModal({ isOpen, onClose, onAddApp, usedApps }: QuickAddModalProps) {
  if (!isOpen) return null;

  const handleAddApp = (app: AppIcon) => {
    if (!usedApps.has(app.id)) {
      onAddApp(app);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="popup-gradient backdrop-blur-xl rounded-xl w-[600px] max-h-[80vh] overflow-hidden border border-white/10 shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-light tracking-wide text-white">Quick Add</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            {quickAddApps.map((app) => {
              const isUsed = usedApps.has(app.id);
              return (
                <button
                  key={app.id}
                  onClick={() => handleAddApp(app)}
                  disabled={isUsed}
                  className={`aspect-square bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center transition-all border border-white/10
                    ${isUsed ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/20 cursor-pointer'}`}
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl mb-3 p-2 flex items-center justify-center">
                    {app.icon && <app.icon className="w-8 h-8 text-white" />}
                  </div>
                  <span className="text-white text-sm font-light tracking-wide">{app.title}</span>
                  {isUsed && (
                    <span className="text-white/60 text-xs mt-1">Already added</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}