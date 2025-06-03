'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from '@/lib/axios';
import Loading from '@/app/(app)/Loading';

function Card({ children, className }) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg transition-transform ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return (
    <div className={`p-4 flex flex-col items-start relative ${className}`}>
      {children}
    </div>
  );
}

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/all-computersales');
      const allSales = Array.isArray(res.data) ? res.data : [];

      const normalizedSales = allSales.map(product => ({
        ...product,
        id: Number(product.id),
      }));

      setProducts(normalizedSales);
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen overflow-y-auto pt-24 pb-16 sm:px-12 py-12">
      <h1 className="text-4xl md:text-5xl bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow-lg text-center mb-12">
        Explore Our Extensive Product Catalog
      </h1>

      {products.length === 0 ? (
        <p className="text-white text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const images = product.media_files ? JSON.parse(product.media_files) : [];

            return (
              <Card key={product.id} className="bg-white/10 border border-yellow-700 backdrop-blur-md hover:scale-105 duration-300">
                {images[0] ? (
                  <Image
                    src={`http://localhost:8000/storage/${images[0]}`}
                    alt={product.product_name}
                    width={200}
                    height={150}
                    unoptimized
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-white">
                    No Image
                  </div>
                )}

                <CardContent className="bg-black/80">
                  <h2 className="text-sm font-semibold text-gray-100 mb-1">{product.product_name}</h2>
                  <p className="text-sm text-gray-300 mb-2">{product.description || 'No description provided.'}</p>
                  <p className="text-xs text-gray-400">Price: MWK {product.price}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
