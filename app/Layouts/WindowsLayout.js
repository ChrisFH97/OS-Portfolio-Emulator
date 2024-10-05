import Desktop from "../components/windows/Desktop";
import WindowsTaskbar from "../components/windows/Taskbar";
import { useState } from 'react';
import '../styles/globals.css';

const WindowsLayout = () => {
  const [AppStatus, setAppStatus] = useState([
    { name: 'Notepad', isMinimized: false, isOpen: false },
    { name: 'Chrome', isMinimized: false, isOpen: false },
    { name: 'FireFox', isMinimized: false, isOpen: false },
    { name: 'Edge', isMinimized: false, isOpen: false },
    { name: 'Spotify', isMinimized: false, isOpen: false },
    { name: 'Calculator', isMinimized: false, isOpen: false },
    { name: 'Minesweeper', isMinimized: false, isOpen: false }
  ]);

  // Helper function to find an app by name
  const getApp = (appName) => AppStatus.find(app => app.name === appName);

  // Generic function to update an app's status dynamically
  const updateAppStatus = (appName, updatedProperties) => {
    setAppStatus(prevStatus =>
      prevStatus.map(app =>
        app.name === appName ? { ...app, ...updatedProperties } : app
      )
    );
  };

  // Generic function to open any app
  const openApp = (appName) => updateAppStatus(appName, { isOpen: true, isMinimized: false });

  // Generic function to close any app
  const closeApp = (appName) => updateAppStatus(appName, { isOpen: false });

  // Generic function to toggle minimize state
  const toggleMinimizeApp = (appName) => {
    const app = getApp(appName);
    updateAppStatus(appName, { isMinimized: !app.isMinimized });
  };

  return (
    <div className="windows-layout fixed">
      {/* Desktop */}
      <Desktop
        apps={AppStatus}
        closeApp={closeApp}
        toggleMinimizeApp={toggleMinimizeApp}
        removeAppFromTaskbar={(appName) => updateAppStatus(appName, { isOpen: false })}
      />

      {/* Taskbar */}
      <WindowsTaskbar
        openApp={openApp}
        toggleMinimizeApp={toggleMinimizeApp}
        AppStatus={AppStatus}
      />
    </div>
  );
};

export default WindowsLayout;
