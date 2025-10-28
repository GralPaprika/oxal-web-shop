import { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  children: ReactNode;
  className?: string;
}

export function DataTable({ columns, children, className = '' }: DataTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {children}
        </tbody>
      </table>
    </div>
  );
}