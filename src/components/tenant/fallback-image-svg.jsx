// HouseScene.js
import React from "react";

const HouseScene = () => (
  <svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#87CEEB", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#E0F6FF", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#8B4513", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#654321", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="houseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#F5F5DC", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#E6E6CD", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#90EE90", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#7CB342", stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    {/* Sky background */}
    <rect width="300" height="180" fill="url(#skyGradient)" />

    {/* Ground */}
    <rect x="0" y="180" width="300" height="70" fill="url(#groundGradient)" />

    {/* Sun */}
    <circle cx="50" cy="40" r="18" fill="#FFD700" opacity="0.8" />
    <g stroke="#FFD700" strokeWidth="2" opacity="0.6">
      <line x1="20" y1="40" x2="28" y2="40" />
      <line x1="72" y1="40" x2="80" y2="40" />
      <line x1="50" y1="10" x2="50" y2="18" />
      <line x1="50" y1="62" x2="50" y2="70" />
      <line x1="28.8" y1="18.8" x2="34.1" y2="24.1" />
      <line x1="65.9" y1="55.9" x2="71.2" y2="61.2" />
      <line x1="71.2" y1="18.8" x2="65.9" y2="24.1" />
      <line x1="34.1" y1="55.9" x2="28.8" y2="61.2" />
    </g>

    {/* Clouds */}
    <g fill="white" opacity="0.7">
      <ellipse cx="180" cy="35" rx="12" ry="8" />
      <ellipse cx="190" cy="35" rx="15" ry="10" />
      <ellipse cx="200" cy="35" rx="10" ry="7" />

      <ellipse cx="240" cy="55" rx="8" ry="6" />
      <ellipse cx="248" cy="55" rx="10" ry="8" />
      <ellipse cx="255" cy="55" rx="7" ry="5" />
    </g>

    {/* House main structure */}
    <rect x="80" y="120" width="140" height="100" fill="url(#houseGradient)" stroke="#D3D3D3" strokeWidth="1" />

    {/* Roof */}
    <polygon points="70,120 150,70 230,120" fill="url(#roofGradient)" stroke="#5D4E37" strokeWidth="1" />

    {/* Chimney */}
    <rect x="190" y="80" width="15" height="25" fill="#8B4513" stroke="#654321" strokeWidth="1" />
    <rect x="185" y="80" width="25" height="5" fill="#A0522D" />

    {/* Chimney smoke */}
    <g fill="lightgray" opacity="0.6">
      <circle cx="198" cy="70" r="3" />
      <circle cx="195" cy="65" r="2.5" />
      <circle cx="200" cy="60" r="2" />
      <circle cx="197" cy="55" r="1.5" />
    </g>

    {/* Door */}
    <rect x="135" y="170" width="30" height="50" fill="#8B4513" stroke="#654321" strokeWidth="1" rx="15" />
    <circle cx="157" cy="195" r="2" fill="#FFD700" />

    {/* Door panels */}
    <rect x="140" y="175" width="20" height="15" fill="none" stroke="#654321" strokeWidth="1" rx="2" />
    <rect x="140" y="195" width="20" height="20" fill="none" stroke="#654321" strokeWidth="1" rx="2" />

    {/* Windows */}
    <rect x="95" y="140" width="25" height="25" fill="#87CEEB" stroke="#4682B4" strokeWidth="2" rx="2" />
    <line x1="107.5" y1="140" x2="107.5" y2="165" stroke="#4682B4" strokeWidth="1" />
    <line x1="95" y1="152.5" x2="120" y2="152.5" stroke="#4682B4" strokeWidth="1" />

    <rect x="180" y="140" width="25" height="25" fill="#87CEEB" stroke="#4682B4" strokeWidth="2" rx="2" />
    <line x1="192.5" y1="140" x2="192.5" y2="165" stroke="#4682B4" strokeWidth="1" />
    <line x1="180" y1="152.5" x2="205" y2="152.5" stroke="#4682B4" strokeWidth="1" />

    {/* Upstairs window */}
    <rect x="137.5" y="100" width="25" height="20" fill="#87CEEB" stroke="#4682B4" strokeWidth="2" rx="2" />
    <line x1="150" y1="100" x2="150" y2="120" stroke="#4682B4" strokeWidth="1" />
    <line x1="137.5" y1="110" x2="162.5" y2="110" stroke="#4682B4" strokeWidth="1" />

    {/* Window boxes with flowers */}
    <rect x="93" y="165" width="29" height="4" fill="#8B4513" />
    <rect x="178" y="165" width="29" height="4" fill="#8B4513" />

    {/* Flowers in window boxes */}
    <g>
      <circle cx="100" cy="163" r="1.5" fill="#FF69B4" />
      <circle cx="105" cy="163" r="1.5" fill="#FF1493" />
      <circle cx="110" cy="163" r="1.5" fill="#FFB6C1" />
      <circle cx="115" cy="163" r="1.5" fill="#FF69B4" />

      <circle cx="185" cy="163" r="1.5" fill="#9370DB" />
      <circle cx="190" cy="163" r="1.5" fill="#8A2BE2" />
      <circle cx="195" cy="163" r="1.5" fill="#9370DB" />
      <circle cx="200" cy="163" r="1.5" fill="#DDA0DD" />
    </g>

    {/* Tree */}
    <ellipse cx="35" cy="160" rx="20" ry="25" fill="#228B22" />
    <rect x="32" y="180" width="6" height="15" fill="#8B4513" />

    {/* Path to door */}
    <path d="M 150 220 Q 150 210 150 200 Q 150 190 150 180" stroke="#D2B48C" strokeWidth="8" fill="none" opacity="0.6" />

    {/* Garden elements */}
    <circle cx="260" cy="200" r="8" fill="#32CD32" />
    <circle cx="270" cy="195" r="6" fill="#228B22" />
    <circle cx="250" cy="205" r="5" fill="#7CFC00" />
  </svg>
);

export default HouseScene;
