// components/OSLayout.js (Client-side component)
'use client';
import { useEffect, useState } from 'react';
import { detectOSAndBrowser } from '../utils/detectOSAndBrowser';
import WindowsLayout from '../Layouts/WindowsLayout';
// Import other layouts as needed

export default function OSLayout({ children }) {
  const [system, setSystem] = useState({ os: '', browser: '' });

  useEffect(() => {
    const detectedOS = detectOSAndBrowser();
    setSystem(detectedOS);
  }, []);

  // Dynamically return the correct layout based on the detected OS
  const getLayout = () => {
    switch (system.os) {
      case 'Windows':
        return <WindowsLayout>{children}</WindowsLayout>;
      // Add cases for other OS layouts (macOS, Linux, etc.)
      default:
        return <div>Unknown OS</div>;  // Fallback for unknown OS
    }
  };

  // Show loading until OS detection is complete
  if (!system.os) return <div>Loading...</div>;

  return getLayout();
}
