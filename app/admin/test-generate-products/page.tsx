'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, getAllCategories } from '@/lib/actions/product.actions';
import { Button } from '@/components/ui/Button';
import type { CreateProductData } from '@/src/domain/product/product.entity';

export default function GenerateFakeProductsPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [successCount, setSuccessCount] = useState(0);

  // Product data templates
  const productNames = {
    jewelry: [
      'Collar de Plata Artesanal',
      'Pulsera Bohemia Tejida',
      'Anillo Hecho a Mano',
      'Pendientes Elegantes Largos',
      'Cadena Dorada Vintage',
      'Brazalete de Cuero Marrón',
      'Collar Turquesa Natural',
      'Aros Largos Geométricos',
    ],
    clothing: [
      'Blusa Bordada Tradicional',
      'Pantalón Holgado Cómodo',
      'Falda Larga Bohemia',
      'Vestido Bohemio Artesanal',
      'Camisa Artesanal de Lino',
      'Poncho Tejido a Mano',
      'Falda Plisada Floral',
      'Blusa Floral Vintage',
    ],
    decoration: [
      'Tapiz Tejido Colorido',
      'Lámpara Colgante Artesanal',
      'Maceta Cerámica Decorativa',
      'Almohada Bordada Etnica',
      'Espejo Decorativo Bohemio',
      'Vela Aromática Natural',
      'Cuadro Artístico Tejido',
      'Mantel Tejido a Mano',
    ],
    accessories: [
      'Cinturón Tejido Multicolor',
      'Bolsa Artesanal de Cuero',
      'Pañuelo de Seda Natural',
      'Sombrero Bohemio Tejido',
      'Reloj Vintage Artesanal',
      'Mochila Tejida Colorida',
      'Bufanda Larga de Lana',
      'Bandana Floral Estampada',
    ],
  };

  const descriptions = [
    'Pieza única hecha a mano con materiales de alta calidad',
    'Diseño artesanal inspirado en la tradición bohemia',
    'Producto exclusivo con acabados detalladísimos',
    'Creado por artesanos locales con amplia experiencia',
    'Material natural y sostenible, perfectamente tejido',
    'Detalle especial en cada costura y decoración',
    'Artesanía auténtica con historia detrás',
    'Producto consciente hecho con amor',
  ];

  const materials = {
    jewelry: ['Plata', 'Oro', 'Cobre', 'Piedras naturales', 'Perlas'],
    clothing: ['Algodón', 'Seda', 'Lino', 'Lana', 'Poliéster mixto'],
    decoration: ['Cerámica', 'Madera', 'Tela', 'Vidrio', 'Metal'],
    accessories: ['Cuero', 'Tela tejida', 'Metal', 'Madera', 'Algodón orgánico'],
  };

  const tags = [
    'artesanal',
    'bohemio',
    'hecho a mano',
    'único',
    'sostenible',
    'natural',
    'vintage',
    'etnico',
    'autentico',
  ];

  const categories = ['jewelry', 'clothing', 'decoration', 'accessories'];

  function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  async function generateFakeProducts() {
    setIsGenerating(true);
    setProgress(0);
    setStatus('Cargando categorías...');
    setSuccessCount(0);

    try {
      // Get categories
      const categoriesResult = await getAllCategories();
      if (!categoriesResult.success || !categoriesResult.categories) {
        setStatus('❌ Error: No se pudieron cargar las categorías');
        setIsGenerating(false);
        return;
      }

      const categoryMap: Record<string, string> = {};
      categoriesResult.categories.forEach((cat) => {
        const key = cat.key as keyof typeof productNames;
        categoryMap[key] = cat.id;
      });

      setStatus('Generando 100 productos...');

      // Generate and create products
      for (let i = 0; i < 100; i++) {
        try {
          const categoryKey = getRandomElement(categories) as keyof typeof productNames;
          const categoryId = categoryMap[categoryKey];

          if (!categoryId) {
            continue;
          }

          const productData: CreateProductData = {
            code: `TEST${String(i + 1).padStart(4, '0')}`,
            name: getRandomElement(productNames[categoryKey]),
            description: getRandomElement(descriptions),
            price: Math.round((Math.random() * 150 + 10) * 100) / 100,
            stock: Math.floor(Math.random() * 50) + 1,
            categoryId,
            isStarred: false,
            badge: Math.random() > 0.8 ? getRandomElement(['new', 'sale'] as const) : null,
            images: [
              {
                url: `https://picsum.photos/id/${27 + i}/400`,
                alt: `${categoryKey} product image`,
                order: 0,
                isPrimary: true,
              },
            ],
            tags: getRandomElements(tags, Math.floor(Math.random() * 4) + 1),
            metadata: {
              weight: Math.round(Math.random() * 1000) / 100,
              dimensions: {
                length: Math.round(Math.random() * 50) + 10,
                width: Math.round(Math.random() * 50) + 10,
                height: Math.round(Math.random() * 50) + 10,
              },
              materials: getRandomElements(
                materials[categoryKey],
                Math.floor(Math.random() * 3) + 1
              ),
            },
          };

          const result = await createProduct(productData);
          if (result.success) {
            setSuccessCount((prev) => prev + 1);
          }

          setProgress(Math.round(((i + 1) / 100) * 100));
          setStatus(`Generando... ${i + 1}/100`);
          } catch {
            // Skip on error
          }
      }

      setStatus('✅ ¡Generación completada!');
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-200">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              Generar 100 Productos de Prueba
            </h1>
            <p className="text-amber-700">
              Crea 100 productos falsos para testing y desarrollo. Todos con status activo y ninguno marcado como destacado.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Se crearán 100 productos con datos aleatorios</li>
              <li>✓ Códigos: TEST0001 a TEST0100</li>
              <li>✓ Distribuidos aleatoriamente entre 4 categorías</li>
              <li>✓ Precios: $10 - $160</li>
              <li>✓ Stock: 1 - 50 unidades</li>
              <li>✓ Ninguno será marcado como destacado</li>
              <li>✓ ~20% tendrá badges &quot;new&quot; o &quot;sale&quot;</li>
            </ul>
          </div>

          {/* Progress Section */}
          {isGenerating && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{status}</span>
                <span className="text-sm font-semibold text-amber-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Message */}
          {status && !isGenerating && (
            <div className="p-4 rounded-lg mb-8 bg-green-50 border border-green-200">
              <p className="font-medium text-green-800">{status}</p>
              {successCount > 0 && (
                <p className="text-sm text-green-700 mt-1">✓ Creados: {successCount}</p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={generateFakeProducts}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {isGenerating ? 'Generando...' : 'Generar 100 Productos'}
            </Button>
            <Button
              onClick={() => router.back()}
              disabled={isGenerating}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              Volver
            </Button>
          </div>

          {/* Warning */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Advertencia:</strong> Esta es una página de desarrollo. Solo úsala para testing.
              Los productos creados serán reales en la base de datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
