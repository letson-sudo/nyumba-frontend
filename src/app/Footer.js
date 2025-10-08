import { FaFacebookF, FaWhatsapp, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome, FaSearch, FaHeart, FaUser } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-blue-400 rounded-lg rotate-45"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-400 rounded-full"></div>
      </div>

      <div className="relative px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

            {/* Brand Section */}
            <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaHome className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                  Nyumba
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Your trusted partner in finding the perfect home. Connecting dreams with reality through innovative real estate solutions.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-600 font-medium">Active in Malawi</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 relative">
                Quick Links
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent mt-2"></div>
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group">
                    <FaSearch className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>Search Properties</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group">
                    <FaHeart className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>Saved Properties</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group">
                    <FaUser className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>For Agents</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group">
                    <FaHome className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>List Your Property</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 relative">
                Our Services
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent mt-2"></div>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-700 font-medium">Property Sales & Rentals</p>
                    <p className="text-gray-500 text-sm">Houses, apartments, commercial spaces</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-700 font-medium">Property Management</p>
                    <p className="text-gray-500 text-sm">Full-service property care</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-700 font-medium">Real Estate Consultation</p>
                    <p className="text-gray-500 text-sm">Expert market guidance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 relative">
                Get In Touch
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent mt-2"></div>
              </h3>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FaEnvelope className="text-blue-500" />
                  </div>
                  <div>
                    <a href="mailto:info@nyumbamalawi.com" className="hover:text-blue-600 transition-colors block">
                      info@nyumbamalawi.com
                    </a>
                    <span className="text-gray-500 text-sm">24/7 Support</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FaPhone className="text-blue-500" />
                  </div>
                  <div>
                    <span className="block">+265 983 617 465</span>
                    <span className="text-gray-500 text-sm">Mon - Sat, 8AM - 6PM</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FaMapMarkerAlt className="text-blue-500" />
                  </div>
                  <div>
                    <span className="block">Capital Hill HQ</span>
                    <span className="text-gray-500 text-sm">Lilongwe, Malawi</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-gray-700 font-medium mb-4">Follow Us</p>
                <div className="flex gap-3">
                  <a href="#" className="w-12 h-12 bg-gray-100 hover:bg-blue-500 border border-gray-200 hover:border-blue-500 rounded-xl flex items-center justify-center transition-all duration-300 group">
                    <FaFacebookF className="text-gray-600 group-hover:text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-100 hover:bg-blue-500 border border-gray-200 hover:border-blue-500 rounded-xl flex items-center justify-center transition-all duration-300 group">
                    <FaWhatsapp className="text-gray-600 group-hover:text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-100 hover:bg-blue-500 border border-gray-200 hover:border-blue-500 rounded-xl flex items-center justify-center transition-all duration-300 group">
                    <FaLinkedinIn className="text-gray-600 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-500 text-sm text-center md:text-left">
                © 2025 Nyumba. All rights reserved. Made with ❤️ in Malawi
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Help Center</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
