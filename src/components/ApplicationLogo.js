import React from 'react';

const ApplicationLogo = ({ className = "w-44 h-44", variant = "default" }) => {
  const variants = {
    default: {
      primary: "#2563eb", // Blue-600
      secondary: "#1d4ed8", // Blue-700
      accent: "#3b82f6", // Blue-500
      roof: "#4A5568", // Gray-600
      roofAccent: "#2D3748", // Gray-800
      walls: "#8B7B6B", // Warm gray
      wallsAccent: "#7A6B5B", // Darker warm gray
      windows: "#FFF4E6", // Warm white
      door: "#8B4513" // Saddle brown
    },
    dark: {
      primary: "#60a5fa", // Blue-400
      secondary: "#3b82f6", // Blue-500
      accent: "#93c5fd", // Blue-300
      roof: "#6B7280", // Gray-500
      roofAccent: "#374151", // Gray-700
      walls: "#9CA3AF", // Gray-400
      wallsAccent: "#6B7280", // Gray-500
      windows: "#F3F4F6", // Gray-100
      door: "#D97706" // Amber-600
    },
    gradient: "url(#logoGradient)"
  };

  const colors = variant === "gradient" ? {} : variants[variant] || variants.default;

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient definition for gradient variant */}
      {variant === "gradient" && (
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      )}

      {/* Rounded background */}
      {/* <circle cx="20" cy="20" r="20" fill="#f3f4f6" stroke="none"/> */}

      {/* Logo container */}
      <g transform="translate(60, 60)">
        {/* Main house base structure */}
        <rect
          x="-25"
          y="-5"
          width="50"
          height="22"
          fill={variant === "gradient" ? variants.gradient : colors.walls}
          stroke="none"
        />

        {/* Garage section */}
        <rect
          x="-25"
          y="10"
          width="18"
          height="12"
          fill={variant === "gradient" ? variants.gradient : colors.wallsAccent}
          stroke="none"
        />

        {/* Main peaked roof */}
        <path
          d="M-28,-5 L0,-32 L28,-5 Z"
          fill={variant === "gradient" ? variants.gradient : colors.roof}
        />

        {/* Front gable roof */}
        <path
          d="M-12,-5 L5,-22 L22,-5 Z"
          fill={variant === "gradient" ? variants.gradient : colors.roofAccent}
        />

        {/* Garage roof */}
        <path
          d="M-25,10 L-16,5 L-7,10 Z"
          fill={variant === "gradient" ? variants.gradient : colors.roof}
        />

        {/* Large front windows with warm glow */}
        <rect
          x="-8"
          y="-2"
          width="8"
          height="12"
          fill={colors.windows || "#FFF4E6"}
          stroke={variant === "gradient" ? variants.gradient : colors.walls}
          strokeWidth="0.8"
        />
        <rect
          x="2"
          y="-2"
          width="8"
          height="12"
          fill={colors.windows || "#FFF4E6"}
          stroke={variant === "gradient" ? variants.gradient : colors.walls}
          strokeWidth="0.8"
        />

        {/* Window cross frames */}
        <line
          x1="-4"
          y1="-2"
          x2="-4"
          y2="10"
          stroke={variant === "gradient" ? variants.gradient : colors.walls}
          strokeWidth="0.6"
        />
        <line
          x1="-8"
          y1="4"
          x2="0"
          y2="4"
          stroke={variant === "gradient" ? variants.gradient : colors.walls}
          strokeWidth="0.6"
        />
        <line
          x1="6"
          y1="-2"
          x2="6"
          y2="10"
          stroke={variant === "gradient" ? variants.gradient : colors.walls}
          strokeWidth="0.6"
        />
        <line
          x1="2"
          y1="4"
          x2="10"
          y2="4"
          stroke={variant === "gradient" ? variants.gradient : colors.walls}
          strokeWidth="0.6"
        />

        {/* Upper triangular window */}
        <path
          d="M-8,-12 L5,-18 L18,-12 L18,-8 L-8,-8 Z"
          fill={colors.windows || "#FFF4E6"}
          stroke={variant === "gradient" ? variants.gradient : colors.walls}
          strokeWidth="0.8"
        />
        <line
          x1="5"
          y1="-18"
          x2="5"
          y2="-8"
          stroke={variant === "gradient" ? variants.gradient : colors.walls}
          strokeWidth="0.6"
        />

        {/* Front door */}
        <rect
          x="12"
          y="5"
          width="6"
          height="12"
          fill={variant === "gradient" ? variants.gradient : colors.door}
          stroke={variant === "gradient" ? "#654321" : "#654321"}
          strokeWidth="0.8"
        />
        <circle
          cx="16.5"
          cy="11"
          r="0.5"
          fill="#DAA520"
        />

        {/* Garage door */}
        <rect
          x="-23"
          y="12"
          width="14"
          height="8"
          fill={variant === "gradient" ? variants.gradient : "#6B5B4B"}
          stroke="#5A4B3B"
          strokeWidth="0.8"
        />
        <line
          x1="-23"
          y1="15"
          x2="-9"
          y2="15"
          stroke="#5A4B3B"
          strokeWidth="0.5"
        />
        <line
          x1="-23"
          y1="17"
          x2="-9"
          y2="17"
          stroke="#5A4B3B"
          strokeWidth="0.5"
        />

        {/* Foundation detail */}
        <rect
          x="-26"
          y="17"
          width="52"
          height="1.5"
          fill={variant === "gradient" ? variants.gradient : "#6B5B4B"}
        />

        {/* Chimney */}
        <rect
          x="20"
          y="-20"
          width="3"
          height="8"
          fill={variant === "gradient" ? variants.gradient : colors.roof}
        />
      </g>
    </svg>
  );
};

export default ApplicationLogo;
