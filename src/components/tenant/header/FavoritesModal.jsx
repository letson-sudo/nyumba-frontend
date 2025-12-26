"use client";
import React from 'react';
import { X, Heart, Home } from 'lucide-react';

const FavoritesModal = ({ isOpen, onClose, favorites = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[7000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            Saved Properties
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-80 p-4">
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No saved properties yet</p>
            </div>
          ) : (
            favorites.map(property => (
              <div key={property.id} className="flex items-center p-3 border-b hover:bg-gray-50">
                <Home className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-sm text-gray-500">{property.location}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
