import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  rightContent?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  rightContent, 
  children, 
  className = '' 
}: SectionCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 ${className}`}>
      <div className="px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-6 w-6 text-amber-600" />}
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
              {subtitle && (
                <p className="text-sm text-text-secondary">{subtitle}</p>
              )}
            </div>
          </div>
          {rightContent && (
            <div className="flex items-center">
              {rightContent}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}