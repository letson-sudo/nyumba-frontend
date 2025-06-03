'use client';

import { useEffect, useState } from 'react';
import { FaAndroid, FaGlobe, FaDesktop, FaStar } from 'react-icons/fa';
import { MdWebAsset } from 'react-icons/md';
import Loading from '@/app/(app)/Loading';

export default function SoftwareDevelopment() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/software-development-service');
      if (!res.ok) throw new Error('Failed to fetch services');

      const data = await res.json();
      const formatted = Array.isArray(data)
        ? data.map((item) => ({
            title: item.service_title || 'Unnamed Service',
            description: item.description || 'No description provided.',
            rating: Number(item.rating) || 0,
            icon: (() => {
              switch (item.icon_key) {
                case 'android':
                  return <FaAndroid className="text-5xl text-green-400" />;
                case 'web':
                  return <FaGlobe className="text-5xl text-blue-400" />;
                case 'desktop':
                  return <FaDesktop className="text-5xl text-purple-400" />;
                case 'management':
                  return <MdWebAsset className="text-5xl text-yellow-400" />;
                default:
                  return <FaGlobe className="text-5xl text-white" />;
              }
            })(),
          }))
        : [];

      setServices(formatted);
    } catch (err) {
      console.error('❌ Error fetching software services:', err);
      setError('Could not load software development services.');
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
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-[#f5d478] via-[#f5d478] to-[#f5d478] bg-clip-text text-transparent drop-shadow-lg">
        Software Development & Installation Services
      </h2>

     

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        {services.map((service, index) => (
          <div
            key={index}
            className="cursor-pointer bg-black/60 hover:bg-black/40 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="flex justify-center mb-5">{service.icon}</div>
            <h3 className="text-xl font-semibold text-center group-hover:text-[#f5d478] transition-colors">
              {service.title}
            </h3>
            <p className="text-gray-300 text-sm text-center mt-3 leading-relaxed">{service.description}</p>
            <div className="flex justify-center mt-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-lg ${i < service.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
