'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Loading from '@/app/(app)/Loading';
import { Button } from '../ui/button';
import SidebarLayout from '@/components/Layouts/SidebarLayout';
import { useRouter } from 'next/navigation';

const LabeledField = ({ label, value }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-white font-semibold">{label}:</span>
    <span className="bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow-lg px-5 py-1 text-bold">
      {value || 'N/A'}
    </span>
  </div>
);

const ReviewComputerSale = () => {
  const [sales, setSales] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchSoldItems = async () => {
    try {
      const res = await axios.get('/api/sold-items');
      setSoldItems(res.data);
    } catch (err) {
      console.error('Error fetching sold items:', err);
    }
  };

  const fetchSales = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.get('/api/computersales');
      setSales(response.data);
      await fetchSoldItems();
    } catch (err) {
      console.error('Error fetching computer sales:', err);
      setError('Failed to load sales data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const getSaleStatus = (saleId) => {
    const record = soldItems.find(item => item.computer_sale_id === saleId);
    return record?.status || 'available';
  };

  const handleToggleSoldStatus = async (computer_sale_id) => {
    try {
      await axios.post('/api/sold-items', { computer_sale_id });
      alert('Status toggled successfully.');
      fetchSales();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert('Failed to update status.');
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  if (sales.length === 0) {
    return <p className="text-white text-center">No computer sales found for your account.</p>;
  }

  return (
    <div className="py-16">
      <SidebarLayout>
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="w-full max-w-3xl space-y-6">
            {sales.map((sale) => {
              const status = getSaleStatus(sale.id);
              return (
                <div key={sale.id} className="bg-black/75 p-6 rounded-lg shadow-md text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <LabeledField label="Product" value={sale.product_name} />
                      <LabeledField label="Price" value={`MWK ${sale.price}`} />
                      <LabeledField label="Location" value={sale.location} />
                    </div>
                    <div>
                      <LabeledField label="Quantity" value={sale.quantity} />
                      <LabeledField label="Warranty" value={sale.warranty || 'None'} />
                      <LabeledField label="Description" value={sale.description || 'No description provided.'} />
                      <LabeledField label="Status" value={status === 'sold' ? 'Sold' : 'Available'} />
                    </div>
                  </div>

                  {sale.media_files && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {JSON.parse(sale.media_files).map((url, i) => (
                        <img
                          key={i}
                          src={`http://localhost:8000/${url}`}
                          alt="Media"
                          className="rounded max-h-48 object-cover w-full"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end mt-4 gap-3">
                    <Button
                      onClick={() => router.push(`/editreviewcomputerdashboard?id=${sale.id}`)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleSoldStatus(sale.id)}
                      className={
                        status === 'sold'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }
                    >
                      {status === 'sold' ? 'Mark as Available' : 'Mark as Sold'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default ReviewComputerSale;
