import { X } from 'lucide-react';

interface UninstallDialogProps {
  appTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UninstallDialog({ appTitle, isOpen, onClose, onConfirm }: UninstallDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-[#0a1f1d] rounded-lg w-[400px] border border-white/10 shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-light text-white">Conferma disinstallazione</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-white/80 mb-6">App da disinstallare: {appTitle}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white/80 hover:bg-white/10 rounded transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-black text-white rounded hover:bg-black/80 transition-colors"
            >
              Disinstalla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}