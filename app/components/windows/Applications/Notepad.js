'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import CloseIcon from '../../common/Windows/Icons/Close';
import MaximizeIcon from '../../common/Windows/Icons/Maximize';
import MinimizeIcon from '../../common/Windows/Icons/Minimize';

const Notepad = ({ setIsAppDragging, onCloseNotepad, isMinimized, onMinimizeToggle }) => {
  const [content, setContent] = useState(''); // Notepad content
  const [title, setTitle] = useState('Untitled'); // Title for Notepad

  // State for window size, position, and maximized state
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [position, setPosition] = useState({ x: 30, y: 30 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState(size);
  const [previousPosition, setPreviousPosition] = useState(position);
  const [closing, setClosing] = useState(false); // To manage closing animation
  const [fadeIn, setFadeIn] = useState(true); // For fade-in effect
  const [isFadingOut, setIsFadingOut] = useState(false); // To manage fade effect during minimizing

  const rndRef = useRef(null); // Reference to the Rnd component

  // Fade in when opening
  useEffect(() => {
    setFadeIn(true); // Trigger fade-in on open
  }, []);

  const handleResize = (e, direction, ref, delta, newPosition) => {
    setSize({ width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) });
    setPosition(newPosition);
  };

  const handleDrag = (e, d) => {
    const newX = Math.max(0, Math.min(d.x, window.innerWidth - size.width));
    const newY = Math.max(0, Math.min(d.y, window.innerHeight - size.height));
    setPosition({ x: newX, y: newY });
  };

  const handleMaximize = () => {
    const rndElement = rndRef.current?.resizableElement.current;
    if (rndElement) {
      rndElement.style.transition = 'all 0.3s ease'; // Apply transition to maximize/restore
    }

    if (isMaximized) {
      // Restore to previous size and position
      setSize(previousSize);
      setPosition(previousPosition);

      if (rndElement) {
        rndElement.style.transition = ''; // Remove transition after maximized
      }
    } else {
      // Save current size and position, then maximize
      setPreviousSize(size);
      setPreviousPosition(position);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }

    setIsMaximized(!isMaximized);
  };

  // Handle close with fade-out
  const handleClose = () => {
    setClosing(true); // Start fade-out
    setTimeout(() => {
      onCloseNotepad();
    }, 300); // Delay to allow fade-out transition
  };

  // Handle minimize with fade-out effect
  const handleMinimize = () => {
    setIsFadingOut(true); // Start fading out
    setTimeout(() => {
      onMinimizeToggle(); // Minimize after fade-out
      setIsFadingOut(false); // Reset fade-out
    }, 300); // Delay for the fade-out transition
  };

  // Handle unminimize with fade-in effect
  useEffect(() => {
    if (!isMinimized) {
      setFadeIn(true); // Trigger fade-in on unminimize
    }
  }, [isMinimized]);

  // Render nothing if minimized
  if (isMinimized) return null;

  return (
    <Rnd
      ref={rndRef}
      size={size}
      position={position}
      onResize={handleResize}
      onDrag={handleDrag}
      minWidth={300}
      minHeight={200}
      bounds="window"
      className={`rounded-lg shadow-lg notepad-window transition-opacity duration-300 ${
        closing || isFadingOut ? 'opacity-0' : fadeIn ? 'opacity-100' : 'opacity-0'
      } ${isMaximized ? 'transition-all duration-300' : ''}`} // Transition for opening/closing, maximizing, minimizing
      dragHandleClassName="application-header"
      onDragStart={() => setIsAppDragging(true)}
      onDragStop={() => setIsAppDragging(false)}
      onResizeStart={() => setIsAppDragging(true)}
      onResizeStop={() => setIsAppDragging(false)}
      enableResizing={!isMaximized} // Disable resizing when maximized
    >
      <div className="flex flex-col h-full text-white rounded-lg">
        {/* Notepad Header */}
        <div className="notepad-header application-header backdrop-blur-[5px] bg-[#202020] flex items-center justify-between rounded-tl-md rounded-tr-md">
          <div className="flex items-center space-x-2 px-4 py-2">
            <img src="/windows/notepad.png" alt="Notepad Icon" className="w-5 h-5" />
            <span className="text-sm">{title}</span>
          </div>

          {/* Minimize, Maximize, and Close */}
          <div className="flex items-center">
            <button className="h-10 w-10 hover:bg-[#383838] flex items-center justify-center" onClick={handleMinimize}>
              <MinimizeIcon />
            </button>
            <button className="h-10 w-10 hover:bg-[#383838] flex items-center justify-center" onClick={handleMaximize}>
              <MaximizeIcon />
            </button>
            <button className="h-10 w-10 hover:bg-[#a63b23] rounded-tr-md" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Notepad Menu */}
        <div className="flex items-center justify-between max-h-[32px] h-full p-2 bg-[#2c2c2c]">
          <div className="flex items-center space-x-4">
            <button className="ml-2 text-sm px-2 p-1 rounded-[2.5px] hover:bg-[#383838]">File</button>
            <button className="text-sm px-2 p-1 rounded-[2.5px] hover:bg-[#383838]">Edit</button>
            <button className="text-sm px-2 p-1 rounded-[2.5px] hover:bg-[#383838]">View</button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          className="flex-grow bg-app-background p-4 resize-none focus:outline-none rounded-br-md rounded-bl-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder=""
        />
      </div>
    </Rnd>
  );
};

export default Notepad;
