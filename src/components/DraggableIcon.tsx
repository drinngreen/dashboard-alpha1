import { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { AppIcon } from '../types';

interface DraggableIconProps {
  icon: AppIcon;
  position?: { x: number; y: number };
  onDrop: (id: string, x: number, y: number, targetId?: string) => void;
  isTrash?: boolean;
}

export function DraggableIcon({ icon, position, onDrop, isTrash = false }: DraggableIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggingTouch, setIsDraggingTouch] = useState(false);
  const touchOffset = useRef<{ x: number; y: number } | null>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'APP_ICON',
    item: { id: icon.id, isTrashable: !isTrash },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (!dropResult) {
        const offset = monitor.getClientOffset();
        if (offset && !isTrash) {
          onDrop(item.id, offset.x, offset.y);
        }
      }
    },
    canDrag: !isTrash,
  }), [icon.id, isTrash, onDrop]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'APP_ICON',
    drop: (item: { id: string; isTrashable: boolean }) => {
      if (isTrash && item.isTrashable) {
        onDrop(item.id, 0, 0, 'trash');
        return { id: 'trash' };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  }), [isTrash, onDrop]);

  useEffect(() => {
    if (isTrash) {
      drop(ref);
    } else {
      drag(ref);
      preview(ref);
    }
  }, [drag, drop, preview, isTrash]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTrash) return;
    
    const touch = e.touches[0];
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      touchOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      setIsDraggingTouch(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingTouch || !touchOffset.current || isTrash) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - touchOffset.current.x;
    const newY = touch.clientY - touchOffset.current.y;
    
    if (ref.current) {
      ref.current.style.left = `${newX}px`;
      ref.current.style.top = `${newY}px`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingTouch || isTrash) return;
    
    setIsDraggingTouch(false);
    touchOffset.current = null;
    
    const touch = e.changedTouches[0];
    onDrop(icon.id, touch.clientX, touch.clientY);
  };

  const IconComponent = icon.icon;

  const style = position ? {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    transform: 'none',
    opacity: isDragging || isDraggingTouch ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDraggingTouch ? 1000 : 1,
  } : {};

  return (
    <div
      ref={ref}
      style={style}
      className={`draggable-icon w-20 h-20 flex flex-col items-center justify-center touch-none select-none
        ${isTrash ? 'cursor-default' : ''} 
        ${isOver ? 'bg-white/10' : ''}
        rounded-lg transition-colors`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`w-12 h-12 rounded-lg ${isTrash ? 'bg-white/10' : 'bg-white/10'} p-2 mb-2 flex items-center justify-center`}>
        {IconComponent && (
          <IconComponent className={`w-8 h-8 ${isOver ? 'text-red-400' : 'text-white'}`} />
        )}
      </div>
      <span className="text-xs text-white text-center font-medium">
        {icon.title}
      </span>
    </div>
  );
}