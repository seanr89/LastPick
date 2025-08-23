
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  text: string;
  variant?: 'primary' | 'secondary';
}

const IconButton: React.FC<IconButtonProps> = ({ icon, text, variant = 'primary', ...props }) => {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  const variantClasses = {
    primary: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500",
    secondary: "bg-slate-600 text-slate-200 hover:bg-slate-700 focus:ring-slate-500",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default IconButton;
