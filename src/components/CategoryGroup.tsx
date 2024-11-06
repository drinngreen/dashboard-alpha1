import { useDrop } from 'react-dnd';
import type { AppIcon, Category } from '../types';
import { DraggableIcon } from './DraggableIcon';

interface CategoryGroupProps {
  category: Category;
  onDrop: (icon: AppIcon, categoryId: string) => void;
}

export function CategoryGroup({ category, onDrop }: CategoryGroupProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'APP_ICON',
    drop: (item: AppIcon) => onDrop(item, category.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-6 rounded-xl bg-white/5 backdrop-blur-lg transition-all ${
        isOver ? 'bg-white/10' : ''
      } border border-white/10`}
    >
      <h2 className="text-xl font-semibold text-white mb-4">{category.title}</h2>
      <div className="grid grid-cols-4 gap-4">
        {category.icons.map((icon) => (
          <DraggableIcon key={icon.id} icon={icon} />
        ))}
      </div>
    </div>
  );
}