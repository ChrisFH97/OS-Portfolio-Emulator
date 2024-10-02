'use client';
import { useEffect, useState } from 'react';
import { detectOSAndBrowser } from './utils/detectOSAndBrowser';

const SystemEmulator = () => {
  const [system, setSystem] = useState({ os: '', browser: '' });

  useEffect(() => {
    const detectedInfo = detectOSAndBrowser();
    setSystem(detectedInfo);
  }, []);

  const renderComponent = () => {
    switch (system.os) {
      case 'Windows':
        return <></>;
      case 'Mac':
        return <></>;
      case 'Ubuntu':
        return <></>;
      case 'iOS':
        return <></>;
      case 'Android':
        return <></>;
      default:
        return <div>Unknown OS or device</div>;
    }
  };

  return (
    <div>
      {system.os ? renderComponent() : <div>Loading...</div>}
    </div>
  );
};

export default SystemEmulator;
