'use client';

import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

interface SectionActionsProps {
  label: string;
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function SectionActions({
  label,
  variant = 'primary',
  size = 'sm'
}: SectionActionsProps) {
  
  const handleAdd = () => {
    // TODO: Implement add functionality
    console.log('Add clicked for:', label);
  };

  return (
    <Button 
      size={size} 
      variant={variant}
      className="flex items-center gap-2"
      onClick={handleAdd}
    >
      <PlusIcon className="h-4 w-4" />
      {label}
    </Button>
  );
}