'use client';
import { useEffect, useState } from 'react';
import { detectOSAndBrowser } from './utils/detectOSAndBrowser';
import WindowsLayout from './Layouts/WindowsLayout';

export default function RootLayout({ children }) {
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
      // case 'Mac':
      //   return <MacLayout>{children}</MacLayout>;
      // case 'Ubuntu':
      //   return <UbuntuLayout>{children}</UbuntuLayout>;
      // case 'iOS':
      // case 'Android':
      //   return <MobileLayout>{children}</MobileLayout>;
      default:
        return <div>Unknown OS</div>;  // Fallback for unknown OS
    }
  };

  // Show loading until OS detection is complete
  if (!system.os) return <div>Loading...</div>;

  return (
    <html lang="en">
      <body>
        {getLayout()}
      </body>
    </html>
  );
}
