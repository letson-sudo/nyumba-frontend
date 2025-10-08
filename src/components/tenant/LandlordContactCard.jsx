import React from "react";
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Shield,
  Award,
  Star,
  Clock,
  TrendingUp
} from "lucide-react";

const LandlordContactCard = ({ property }) => {
  if (!property) return null;

  const handleCall = () => {
    if (property.phone && property.phone !== 'Phone not available') {
      window.location.href = `tel:${property.phone}`;
    }
  };

  const handleMessage = () => {
    if (property.phone && property.phone !== 'Phone not available') {
      window.location.href = `sms:${property.phone}`;
    }
  };

  const handleEmail = () => {
    if (property.email) {
      window.location.href = `mailto:${property.email}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
      {/* Premium Header with Gradient */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Contact Owner
            </h3>
          </div>
          <p className="text-blue-100 text-xs font-medium flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Verified • Trusted Landlord
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Landlord Profile Card */}
        <div className="relative mb-6">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                <User className="w-8 h-8 text-white" />
              </div>
              {/* Verified Badge */}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white shadow-lg">
                <Award className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                {property.landlord || 'Property Owner'}
              </h4>
              {property.rating && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-gray-700">{property.rating}</span>
                  <span className="text-xs text-gray-500">Rating</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Active Now
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="space-y-3 mb-6">
          {/* Phone */}
          <div className="group flex items-center gap-3 p-3.5 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
            <div className="p-2 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 font-medium mb-0.5">Phone Number</div>
              <div className="font-bold text-gray-900 text-sm truncate">
                {property.phone || 'Not available'}
              </div>
            </div>
          </div>

          {/* Email */}
          {property.email && (
            <div className="group flex items-center gap-3 p-3.5 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-md transition-all">
              <div className="p-2 bg-purple-50 group-hover:bg-purple-100 rounded-lg transition-colors">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 font-medium mb-0.5">Email Address</div>
                <div className="font-bold text-gray-900 text-sm truncate">
                  {property.email}
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="group flex items-center gap-3 p-3.5 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all">
            <div className="p-2 bg-emerald-50 group-hover:bg-emerald-100 rounded-lg transition-colors">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 font-medium mb-0.5">Location</div>
              <div className="font-semibold text-gray-900 text-sm line-clamp-1">
                {property.location || 'Location not specified'}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl text-center border border-blue-100 hover:shadow-md transition-all">
            <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
            <div className="text-2xl font-extrabold text-blue-700 mb-0.5">24h</div>
            <div className="text-xs text-blue-600 font-bold">Response Time</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl text-center border border-emerald-100 hover:shadow-md transition-all">
            <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <div className="text-2xl font-extrabold text-emerald-700 mb-0.5">95%</div>
            <div className="text-xs text-emerald-600 font-bold">Response Rate</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleCall}
            disabled={!property.phone || property.phone === 'Phone not available'}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 px-6 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </button>

          <button
            onClick={handleMessage}
            disabled={!property.phone || property.phone === 'Phone not available'}
            className="w-full bg-white text-gray-700 py-3.5 px-6 rounded-xl font-bold border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center justify-center gap-2.5 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <MessageCircle className="w-4 h-4" />
            Send Message
          </button>

          {property.email && (
            <button
              onClick={handleEmail}
              className="w-full bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 py-3.5 px-6 rounded-xl font-bold border-2 border-purple-200 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all flex items-center justify-center gap-2.5 transform hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              Email Owner
            </button>
          )}
        </div>

        {/* Security Badge */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-gray-900 mb-1">Privacy Protected</h5>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your contact information is secure. We never share your details without permission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordContactCard;
