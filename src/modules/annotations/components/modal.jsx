import React from 'react';
import { cn } from "../lib/utils";

export function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null;

  return (
    <div className={cn("fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 overflow-auto", className)}>
      <div className="mt-auto bg-white p-4 rounded-lg shadow-lg min-w-[64rem] my-4">
        <header className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          
          {
            onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            )
          }
        </header>

        {children}
      </div>
    </div>
  );
};
