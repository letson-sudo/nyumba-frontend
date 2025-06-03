import { FaFacebookF, FaWhatsapp, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent mb-4">
            TechConnect Malawi
          </h2>
          <p className="text-sm text-gray-300">
            We sell computers & accessories, offer reliable repairs, networking solutions, and custom software development.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">What We Offer</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>💻 Computer Sales & Accessories</li>
            <li>🛠️ Repairs & Maintenance</li>
            <li>🌐 Networking Solutions</li>
            <li>💾 Software Development</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">Contact</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" /> 
              <a href="mailto:info@techconnectmalawi.com" className="hover:text-yellow-400">info@techconnectmalawi.com</a>
            </li>
            <li>📞 0983617465</li>
            <li>📍 P/Bag 2213, Capital Hill HQ, Lilongwe</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">Connect With Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-yellow-400 transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              <FaWhatsapp />
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2025 TechConnect Malawi. All rights reserved. Capital Hill HQ, Lilongwe.
      </div>
    </footer>
  );
}
