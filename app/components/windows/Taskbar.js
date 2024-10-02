'use client';
import { useEffect, useRef, useState } from 'react';
import localFont from 'next/font/local';
import StartMenu from './StartMenu';

const windowsFont = localFont({ src: '../../fonts/SegoeUIVF.ttf' });

const WindowsTaskbar = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuRef = useRef(null); // Reference for the Start Menu
  const windowsIconRef = useRef(null); // Reference for the Windows icon

  // Toggle start menu visibility
  const handleStartMenuClick = () => {
    setStartMenuOpen(!startMenuOpen);
  };

  // Close the start menu when clicking outside of it or the Windows icon
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside both the Start Menu and the Windows Icon, close the Start Menu
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

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [startMenuOpen]);

  useEffect(() => {
    // Update time and date every minute
    const updateDateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // 24-hour format
      const date = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // Handle Meta (Windows) key press
    const handleKeyDown = (event) => {
      if (event.metaKey || event.key === 'Meta') {
        event.preventDefault(); 
        handleStartMenuClick(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col h-screen"
    >
      <main className="flex-grow">{children}</main>

      {/* Start Menu (animated) */}
      <div
        ref={startMenuRef}  // Reference for the Start Menu
        className={`fixed bottom-[70px] left-0 transition-transform duration-250 ${startMenuOpen ? 'translate-y-0 ease-out' : 'translate-y-[calc(100%+20px)] ease-in'}`}
        style={{ marginLeft: '18px' }}
      >
        <StartMenu />
      </div>

      {/* Taskbar */}
      <footer className="w-full h-[50px] px-[13px] backdrop-blur-[10px] bg-windows-taskbar-opacity text-white flex justify-between items-center fixed bottom-0 left-0 right-0 shadow-lg">
        {/* Windows Icon (click to open/close Start Menu) */}
        <div>
          <div
            ref={windowsIconRef} // Reference for the Windows Icon
            className={`p-2 ${startMenuOpen ? 'bg-[#2d2d2e]' : 'hover:bg-[#2d2d2e]'} rounded-[2.5px] transition duration-300 cursor-pointer`}
            onClick={handleStartMenuClick}
          >
            <img src='/windows/win-11.png' alt="Windows Icon" className="w-6 h-6" />
          </div>
        </div>

        {/* Time and Date */}
        <div className="flex flex-row items-center">
          <div className='flex flex-row items-center p-[8px] hover:bg-[#2d2d2e] rounded-[5px] transition duration-300 cursor-pointer'>
            <img src='/windows/windows-network.png' alt="Network Icon" className="w-[18px] h-[18px] mx-[8px] cursor-pointer" />
            <img src='/windows/windows-speaker.png' alt="Speaker Icon" className="w-[18px] h-[18px] mr-[8px] cursor-pointer" />
          </div>

          {/* Time and Date */}
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
