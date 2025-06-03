'use client';

import React, { useEffect, useState } from 'react';
import { FaNetworkWired, FaWifi, FaTools, FaServer } from 'react-icons/fa';
import axios from '@/lib/axios';
import Loading from '@/app/(app)/Loading';

const NetworkingServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/public-networking-services');
      const data = Array.isArray(res.data) ? res.data : [];

      const formatted = data.map((item) => ({
        id: Number(item.id),
        title: item.service_title || 'Unnamed Service',
        description: item.description || 'No description provided.',
        icon: <FaNetworkWired className="text-5xl text-[#f5d478]" />, // default icon
      }));

      setServices(formatted);
    } catch (err) {
      console.error('❌ Error fetching networking services:', err);
      setError('Could not load networking services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center py-20">{error}</p>;

  return (
    <div className=" text-white px-6 sm:px-12 py-20">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow-lg">
        Explore Our Networking Services
      </h2>

      {services.length === 0 ? (
        <p className="text-white text-center">No networking services available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out group"
            >
              <div className="mb-6 flex items-center justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-4 group-hover:text-[#f5d478] transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-gray-300 text-center leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkingServices;
