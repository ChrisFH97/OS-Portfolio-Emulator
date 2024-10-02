'use client';
import { useEffect, useRef, useState } from 'react';
import localFont from 'next/font/local';
import StartMenu from './StartMenu';

const windowsFont = localFont({ src: '../../fonts/SegoeUIVF.ttf' });

const WindowsTaskbar = ({ openNotepad }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuRef = useRef(null);
  const windowsIconRef = useRef(null);

  const handleStartMenuClick = () => {
    setStartMenuOpen(!startMenuOpen);
  };

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [startMenuOpen]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const date = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
      setCurrentTime(time);
      setCurrentDate(date);
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
        className={`fixed bottom-[70px] left-0 transition-transform duration-250 ${startMenuOpen ? 'translate-y-0 ease-out' : 'translate-y-[calc(100%+20px)] ease-in'}`}
        style={{ marginLeft: '18px' }}
      >
        <StartMenu onOpenNotepad={() => { openNotepad(); setStartMenuOpen(false); }} />
      </div>

      {/* Taskbar */}
      <footer className="w-full h-[50px] px-[13px] backdrop-blur-[10px] bg-windows-taskbar-opacity text-white flex justify-between items-center fixed bottom-0 left-0 right-0 shadow-lg">
        {/* Windows Icon */}
        <div>
          <div
            ref={windowsIconRef}
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
