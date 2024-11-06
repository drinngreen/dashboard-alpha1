import { LucideIcon } from 'lucide-react';

export interface AppIcon {
  id: string;
  title: string;
  category: string;
  icon?: LucideIcon;
  imageUrl?: string;
}

export interface Category {
  id: string;
  title: string;
  icons: AppIcon[];
}