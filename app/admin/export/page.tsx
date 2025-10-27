'use client';

import { useState, useRef } from 'react';
import { getAllCategories, getAllProducts, bulkImportProducts, bulkImportCategories } from '@/lib/actions/product.actions';
import { getAllUsers, bulkImportUsers } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/Button';
import { 
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function ExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportData, setExportData] = useState<string>('');
  const [importResult, setImportResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      console.log('🚀 Starting database export...');
      
      const exportResult: {
        exportInfo: {
          timestamp: string;
          version: string;
          source: string;
        };
        data: {
          categories: unknown[];
          products: unknown[];
          users: unknown[];
        };
      } = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          source: 'oxal-web-shop-firestore'
        },
        data: {
          categories: [],
          products: [],
          users: []
        }
      };

      // Export categories
      console.log('📥 Exporting categories...');
      const categoriesResult = await getAllCategories();
      if (categoriesResult.success && categoriesResult.categories) {
        exportResult.data.categories = categoriesResult.categories;
        console.log(`✅ Exported ${categoriesResult.categories.length} categories`);
      }

      // Export products
      console.log('📥 Exporting products...');
      const productsResult = await getAllProducts();
      if (productsResult.success && productsResult.products) {
        exportResult.data.products = productsResult.products;
        console.log(`✅ Exported ${productsResult.products.length} products`);
      }

      // Export users
      console.log('📥 Exporting users...');
      const usersResult = await getAllUsers();
      if (usersResult.success && usersResult.users) {
        exportResult.data.users = usersResult.users;
        console.log(`✅ Exported ${usersResult.users.length} users`);
      }

      const jsonString = JSON.stringify(exportResult, null, 2);
      setExportData(jsonString);

      // Auto-download file
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database-export-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ Export completed and downloaded!');
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Export failed. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setImportResult('');
      console.log('🚀 Starting database import...');

      const fileContent = await file.text();
      const importData = JSON.parse(fileContent);

      if (!importData.data) {
        throw new Error('Invalid import file format');
      }

      const results = [];

      // Import products
      if (importData.data.products && Array.isArray(importData.data.products)) {
        console.log(`📥 Importing ${importData.data.products.length} products...`);
        try {
          const importResult = await bulkImportProducts(importData.data.products);
          if (importResult.success) {
            results.push(`✅ Successfully imported ${importResult.imported} products`);
            if (importResult.errors && importResult.errors.length > 0) {
              results.push(`⚠️ ${importResult.errors.length} products had errors:`);
              importResult.errors.forEach(error => results.push(`   - ${error}`));
            }
          } else {
            results.push(`❌ Product import failed: ${importResult.error}`);
          }
        } catch (error) {
          results.push(`❌ Product import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Import categories
      if (importData.data.categories && Array.isArray(importData.data.categories)) {
        console.log(`📥 Importing ${importData.data.categories.length} categories...`);
        try {
          const importResult = await bulkImportCategories(importData.data.categories);
          if (importResult.success) {
            results.push(`✅ Successfully imported ${importResult.imported} categories`);
            if (importResult.errors && importResult.errors.length > 0) {
              results.push(`⚠️ ${importResult.errors.length} categories had errors:`);
              importResult.errors.forEach(error => results.push(`   - ${error}`));
            }
          } else {
            results.push(`❌ Category import failed: ${importResult.error}`);
          }
        } catch (error) {
          results.push(`❌ Category import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Import users
      if (importData.data.users && Array.isArray(importData.data.users)) {
        console.log(`📥 Importing ${importData.data.users.length} users...`);
        try {
          const importResult = await bulkImportUsers();
          if (importResult.success) {
            results.push(`✅ Successfully imported ${importResult.imported} users`);
            if (importResult.errors && importResult.errors.length > 0) {
              results.push(`⚠️ ${importResult.errors.length} users had errors:`);
              importResult.errors.forEach(error => results.push(`   - ${error}`));
            }
          } else {
            results.push(`❌ User import failed: ${importResult.error}`);
          }
        } catch (error) {
          results.push(`❌ User import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      const resultText = results.join('\n');
      setImportResult(resultText || 'No data found to import');
      console.log('✅ Import analysis completed!');

    } catch (error) {
      console.error('❌ Import failed:', error);
      setImportResult(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <DocumentTextIcon className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Database Export/Import
            </h1>
            <p className="text-text-secondary">
              Export your Firestore database to JSON format or import from a backup file.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Export Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Export Database</h2>
              
              <div className="text-center">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-6 py-3"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  {isExporting ? 'Exporting...' : 'Export Database'}
                </Button>
              </div>

              {exportData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Export Result:
                  </h3>
                  <div className="bg-neutral-50 rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
                      {exportData.substring(0, 1000)}...
                    </pre>
                  </div>
                  <p className="text-sm text-text-secondary text-center">
                    File downloaded automatically. Full content truncated for display.
                  </p>
                </div>
              )}
            </div>

            {/* Import Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Import Database</h2>
              
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                
                <div className="text-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    variant="outline"
                    className="inline-flex items-center gap-2 px-6 py-3"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    {isImporting ? 'Importing...' : 'Select JSON File'}
                  </Button>
                </div>

                {importResult && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                      Import Result:
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                        {importResult}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Import Status:</h4>
                    <p className="text-sm text-yellow-700">
                      Products: ✅ Full import available<br/>
                      Categories: ✅ Full import available<br/>
                      Users: ⚠️ Requires special Firebase Auth handling
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Current Status:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• ✅ Export: Categories, Products, Users</li>
              <li>• ✅ Import: Products & Categories (full implementation)</li>
              <li>• ⚠️ Import: Users (requires Firebase Auth integration)</li>
              <li>• 📁 Auto-download export files as JSON</li>
              <li>• 📊 Check browser console for detailed logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}