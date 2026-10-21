"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return <Toaster
    position='bottom-right'
    toastOptions={{
      style: {
        background: '#000',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.5)'
      },
      duration: 2000
    }}
  />
};
