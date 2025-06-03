'use client';

import React, { useEffect, useState } from 'react';
import { FaTools, FaDesktop, FaCogs, FaChalkboardTeacher } from 'react-icons/fa';
import axios from '@/lib/axios';
import Loading from '@/app/(app)/Loading';

const RepairCenterServices = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRepairs = async () => {
    try {
      const res = await axios.get('/api/all-electronicrepairs');
      const data = Array.isArray(res.data) ? res.data : [];

      const normalized = data.map((item) => ({
        ...item,
        id: Number(item.id),
      }));

      setRepairs(normalized);
    } catch (err) {
      console.error('❌ Error fetching repair services:', err);
      setError('Failed to load repair services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className=" text-white px-6 sm:px-12 py-20">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow-lg">
        Explore Our Electronic Repair Services
      </h2>

      {repairs.length === 0 ? (
        <p className="text-white text-center">No repair services available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {repairs.map((service) => (
            <div
              key={service.id}
              className="bg-gradient-to-br from-black/80 via-black/50 to-black/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out group"
            >
              <div className="mb-6 flex items-center justify-center">
                {/* Optional: Change icon dynamically based on type or category */}
                <FaTools className="text-5xl text-[#f5d478]" />
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-4 group-hover:text-[#f5d478] transition-colors">
                {service.title || 'Untitled Service'}
              </h3>
              <p className="text-sm text-gray-300 text-center leading-relaxed">
                {service.description || 'No description available.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepairCenterServices;
