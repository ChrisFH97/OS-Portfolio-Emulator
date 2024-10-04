'use client';
import { useEffect, useRef, useState } from 'react';
import localFont from 'next/font/local';
import StartMenu from './StartMenu';

const windowsFont = localFont({ src: '../../fonts/SegoeUIVF.ttf' });

const WindowsTaskbar = ({ openApp, toggleMinimizeApp, AppStatus }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuRef = useRef(null);
  const windowsIconRef = useRef(null);

  // Handle start menu toggle
  const handleStartMenuClick = () => setStartMenuOpen(!startMenuOpen);

  // Handle taskbar app click
  const handleTaskbarAppClick = (appName) => {
    const app = AppStatus.find(app => app.name === appName);
    if (app.isMinimized) {
      openApp(appName); // Unminimize if currently minimized
    } else {
      toggleMinimizeApp(appName); // Minimize if not minimized
    }

    setStartMenuOpen(false);
  };

  useEffect(() => {
    setStartMenuOpen(false);
  }, [AppStatus]);

  // Handle start menu click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startMenuRef.current && 
        !startMenuRef.current.contains(event.target) &&
        windowsIconRef.current && 
        !windowsIconRef.current.contains(event.target)
      ) {
        setStartMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setCurrentDate(now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative flex flex-col">
      {/* Start Menu */}
      <div
        ref={startMenuRef}
        className={`fixed bottom-[70px] left-0 transition-transform duration-250 ${
          startMenuOpen ? 'translate-y-0 ease-out' : 'translate-y-[calc(100%+20px)] ease-in'
        }`}
        style={{ marginLeft: '18px' }}
      >
        <StartMenu onOpenApp={openApp} />
      </div>

      {/* Taskbar */}
      <footer className="w-full h-[50px] px-[13px] backdrop-blur-[10px] bg-windows-taskbar-opacity text-white flex justify-between items-center fixed bottom-0 left-0 right-0 shadow-lg">
        <div className="flex flex-row space-x-2">
          {/* Windows Icon */}
          <div
            ref={windowsIconRef}
            className={`p-2 ${startMenuOpen ? 'bg-[#2d2d2e]' : 'hover:bg-[#2d2d2e]'} rounded-[2.5px] transition duration-300 cursor-pointer`}
            onClick={handleStartMenuClick}
          >
            <img src='/windows/win-11.png' alt="Windows Icon" className="w-6 h-6" />
          </div>

          {/* Open Applications in Taskbar */}
          <div className="flex justify-center items-center">
            {AppStatus.filter(app => app.isOpen).map((app, index) => {
              const isMinimized = app.isMinimized;

              return (
                <div
                  key={index}
                  className="flex justify-center items-center flex-col hover:bg-[#2d2d2e] p-1 px-2 rounded-[2.5px]"
                  onClick={() => handleTaskbarAppClick(app.name)}
                >
                  <img
                    src={`/windows/${app.name.toLowerCase()}.png`}
                    alt={`${app.name} Icon`}
                    className="w-6 cursor-pointer"
                  />
                  {/* Indicator for open/minimized apps */}
                  <div
                    className={`mt-1 ${
                      isMinimized ? 'bg-[#9a9a9a] w-[6px] ' : 'bg-[#f38064] w-[15px]'
                    } h-[2px] rounded-full`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time and Date */}
        <div className="flex flex-row items-center">

          <p className={`text-xs ${windowsFont.className} text-center px-[8px]`}>
            ENG <br/> UK
          </p>

          <div className="flex flex-row items-center py-[8px] px-[2px] hover:bg-[#2d2d2e] rounded-[5px] transition duration-300 cursor-pointer">
            <img src='/windows/windows-network.png' alt="Network Icon" className="w-[18px] h-[18px] mx-[8px] cursor-pointer" />
            <img src='/windows/windows-speaker.png' alt="Speaker Icon" className="w-[18px] h-[18px] mr-[8px] cursor-pointer" />
          </div>

          <div className="flex flex-col items-end space-y-1 ml-[16px]">
            <p className={`text-xs ${windowsFont.className}`}>{currentTime}</p>
            <p className={`text-xs ${windowsFont.className}`}>{currentDate}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WindowsTaskbar;
