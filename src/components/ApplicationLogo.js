import React from 'react';

const ApplicationLogo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 500 500">
      {/* Gradient for "TCM" text */}
      <defs>
        <linearGradient id="tcmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d6a531" />
          <stop offset="50%" stopColor="#f5d478" />
          <stop offset="100%" stopColor="#d6a531" />
        </linearGradient>
      </defs>

      {/* Main text "TCM" with gradient */}
      <text
        fontFamily="Arial, sans-serif"
        fontSize="150px"
        fill="url(#tcmGradient)"
        textAnchor="middle"
        dominantBaseline="central"
        x="250"
        y="250"
      >
        TCM
      </text>

      {/* Subtext "TechConnect" */}
      <text
        fontFamily="Arial, sans-serif"
        fontSize="70px"
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        x="250"
        y="370"
      >
        TechConnect
      </text>
    </svg>
  );
};

export default ApplicationLogo;