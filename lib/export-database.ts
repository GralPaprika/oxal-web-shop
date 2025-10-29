/**
 * Simple database export using existing server actions
 * 
 * Usage: 
 * 1. Go to any admin page 
 * 2. Open browser console
 * 3. Run: exportDatabase()
 * 4. Copy the JSON output and save to a file
 */

import { getAllCategories } from '@/lib/actions/product.actions';

export async function exportDatabase() {
  try {
    console.log('🚀 Starting database export...');
    
    const exportData: {
      exportInfo: {
        timestamp: string;
        version: string;
        source: string;
      };
      data: Record<string, unknown[]>;
    } = {
      exportInfo: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        source: 'oxal-web-shop-firestore'
      },
      data: {}
    };

    // Export categories using existing server action
    try {
      console.log('📥 Exporting categories...');
      const categoriesResult = await getAllCategories();
      
      if (categoriesResult.success && categoriesResult.data?.items) {
        exportData.data.categories = categoriesResult.data.items;
        console.log(`✅ Exported ${categoriesResult.data.items.length} categories`);
      } else {
        console.warn('⚠️ No categories found or error occurred');
        exportData.data.categories = [];
      }
    } catch (error) {
      console.error('❌ Error exporting categories:', error);
      exportData.data.categories = [];
    }

    // TODO: Add products export when you have a getAllProducts server action
    // TODO: Add users export when you have a getAllUsers server action
    
    exportData.data.products = []; // Placeholder
    exportData.data.users = []; // Placeholder

    console.log('✅ Export completed!');
    console.log('📄 Export data:');
    console.log(JSON.stringify(exportData, null, 2));
    
    // Also create downloadable file
    if (typeof window !== 'undefined') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database-export-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('💾 File download started!');
    }
    
    return exportData;
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as typeof window & { exportDatabase: typeof exportDatabase }).exportDatabase = exportDatabase;
}