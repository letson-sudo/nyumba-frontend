import React from "react";

const AuthCard = ({ title, children }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 space-y-6">
      {title && (
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          {title}
        </h2>
      )}
      <div>{children}</div>
    </div>
  );
};

export default AuthCard;
