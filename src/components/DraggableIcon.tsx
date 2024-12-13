import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { AppIcon } from "../types";

interface DraggableIconProps {
  icon: AppIcon;
  position: { x: number; y: number };
  onDrop: (id: string, x: number, y: number, targetId?: string) => void;
  isTrash?: boolean;
}

export function DraggableIcon({
  icon,
  position,
  onDrop,
  isTrash = false,
}: DraggableIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "APP_ICON",
    item: { id: icon.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset && ref.current) {
        const rect = ref.current.parentElement?.getBoundingClientRect();
        if (rect) {
          const x = offset.x - rect.left;
          const y = offset.y - rect.top;
          onDrop(item.id, x, y);
        }
      }
    },
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "APP_ICON",
    drop: () => ({ id: icon.id }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (isTrash) {
      drop(ref);
    } else {
      drag(ref);
    }
  }, [drag, drop, isTrash]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 1000 : 1,
        transition: "all 0.2s ease",
      }}
      className={`draggable-icon w-20 h-20 flex flex-col items-center justify-center ${
        isTrash ? "cursor-default" : ""
      } ${isOver ? "bg-red-400" : ""}`}
    >
      <icon.icon className="w-8 h-8 text-white" />
      <span className="text-xs text-white">{icon.title}</span>
    </div>
  );
}
