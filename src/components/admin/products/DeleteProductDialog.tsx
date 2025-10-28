'use client';

import { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { deleteProduct } from '@/lib/actions/product.actions';
import type { Product } from '@/domain/product/product.entity';

interface DeleteProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (productId: string) => void;
  translations: {
    title: string;
    message: string;
    confirmButton: string;
    cancelButton: string;
    deleting: string;
    success: string;
    error: string;
  };
}

export function DeleteProductDialog({
  product,
  isOpen,
  onClose,
  onDeleted,
  translations: t
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const result = await deleteProduct(product.id);
      
      if (result.success) {
        onDeleted(product.id);
        onClose();
      } else {
        setError(result.error || t.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(t.error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError('');
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t.title}
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            {t.message}
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-600">{product.code}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            {t.cancelButton}
          </Button>
          <Button
            variant="secondary"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            {isDeleting ? t.deleting : t.confirmButton}
          </Button>
        </div>
      </div>
    </div>
  );
}