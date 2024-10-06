'use client';
import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import CloseIcon from '../../common/Windows/Icons/Close';
import MaximizeIcon from '../../common/Windows/Icons/Maximize';
import MinimizeIcon from '../../common/Windows/Icons/Minimize';

const Chrome = ({ setIsAppDragging, onCloseChrome, isMinimized, onMinimizeToggle }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [closing, setClosing] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const iframeRef = useRef(null);

  const handleResize = (e, direction, ref, delta, newPosition) => {
    setSize({ width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) });
    setPosition(newPosition);
  };

  const handleDrag = (e, d) => {
    setPosition({
      x: Math.max(0, Math.min(d.x, window.innerWidth - size.width)),
      y: Math.max(0, Math.min(d.y, window.innerHeight - size.height)),
    });
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 800, height: 600 });
      setPosition({ x: 50, y: 50 });
    } else {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onCloseChrome, 300);
  };

  const handleMinimize = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onMinimizeToggle();
      setIsFadingOut(false);
    }, 300);
  };

  if (isMinimized) return null;

  return (
    <Rnd
      size={size}
      position={position}
      onResize={handleResize}
      onDrag={handleDrag}
      minWidth={500}
      minHeight={400}
      bounds="window"
      className={`rounded-lg shadow-lg transition-opacity duration-300 ${
        closing || isFadingOut ? 'opacity-0' : fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      dragHandleClassName="application-header"
      onDragStart={() => setIsAppDragging(true)}
      onDragStop={() => setIsAppDragging(false)}
      onResizeStart={() => setIsAppDragging(true)}
      onResizeStop={() => setIsAppDragging(false)}
      enableResizing={!isMaximized}
    >
      <div className="flex flex-col h-full text-white rounded-lg bg-app-background">
        {/* Chrome Window Header */}
        <div className="application-header backdrop-blur-[5px] bg-[#202020] flex items-center justify-between rounded-tl-md rounded-tr-md">
          <div className="flex items-center space-x-2 px-4 py-2 relative">
            <img src="/windows/google chrome.png" alt="Chrome Icon" className="w-5 h-5 mr-5" />
            <span className='text-sm bg-[#3c3c3c] px-4 rounded-tl-lg 
            rounded-tr-lg py-2 absolute left-[50px] 
            w-40 text-center bottom-[-2px] flex items-center'> <img src="/windows/icon.jpg" className='w-5 rounded-full mr-2'/> My Portfolio</span>
          </div>
          <div className="flex items-center justify-center">
            <button className="h-10 w-10 hover:bg-[#383838] flex items-center justify-center" onClick={handleMinimize}>
              <MinimizeIcon />
            </button>
            <button className="h-10 w-10 hover:bg-[#383838] flex items-center justify-center" onClick={handleMaximize}>
              <MaximizeIcon />
            </button>
            <button className="h-10 w-10 hover:bg-[#a63b23] flex items-center justify-center" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Address Bar and Navigation Controls */}
        <div className="flex items-center bg-[#3c3c3c] px-3 py-2">
            <div className='p-[8px] rounded-full hover:bg-[#505050]'>
                <img src="/windows/chrome-arrow.png" alt="Back" className="w-[18px] cursor-pointer" />
            </div>

            <div className='p-[8px] rounded-full'>
                <img src="/windows/chrome-arrow.png" alt="Forward" className="w-[18px] rotate-180 opacity-[40%]" />
            </div>

            <div className='p-[8px] rounded-full hover:bg-[#505050]'>
                <img src="/windows/chrome-refresh.png" alt="Refresh" className="w-[18px] cursor-pointer" />
            </div>
            
            {/* Address bar */}
            <div className='flex flex-grow items-center p-3 bg-[#282828] rounded-full mx-2'>
                <label className='text-[#c7c7c5] text-xs mx-2 leading-none'>https://www.chrishaig.com</label>
            </div>
        </div>

        {/* Webpage Content */}
        <div className="flex-grow bg-white flex items-center justify-center">
            <h1 className='text-black'>Chrome Content Here</h1>
        </div>
      </div>
    </Rnd>
  );
};

export default Chrome;
