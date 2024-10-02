'use client';
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import CloseIcon from '../../common/Windows/Icons/Close';
import MaximizeIcon from '../../common/Windows/Icons/Maximize';
import MinimizeIcon from '../../common/Windows/Icons/Minimize';

const Notepad = ({ setIsAppDragging, onCloseNotepad }) => {
  const [content, setContent] = useState(''); // State to store the notepad content
  const [title, setTitle] = useState('Untitled');

  // State to manage size and position
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [position, setPosition] = useState({ x: 30, y: 30 }); // Set initial position

  // Handle resize
  const handleResize = (e, direction, ref, delta, newPosition) => {
    setSize({
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
    });
    setPosition({ x: newPosition.x, y: newPosition.y });
  };

  // Handle drag and ensure it stays within screen bounds
  const handleDrag = (e, d) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Adjust tolerance for boundaries
    const leftBoundary = 0;
    const topBoundary = 0;
    const rightBoundary = windowWidth - size.width;
    const bottomBoundary = windowHeight - size.height;

    // Ensure the app doesn't go off-screen by calculating new x and y coordinates
    const newX = Math.max(leftBoundary, Math.min(d.x, rightBoundary));
    const newY = Math.max(topBoundary, Math.min(d.y, bottomBoundary));

    setPosition({ x: newX, y: newY });
  };

  return (
    <Rnd
      size={size}
      position={position}
      onResize={handleResize}
      onDrag={handleDrag} // Handle drag to ensure it respects boundaries
      minWidth={300}
      minHeight={200}
      bounds="window"
      className="rounded-lg shadow-lg"
      dragHandleClassName="application-header"  // Make sure this class matches with the header div
      onDragStart={() => setIsAppDragging(true)}
      onDragStop={() => setIsAppDragging(false)}
      onResizeStart={() => setIsAppDragging(true)}
      onResizeStop={() => setIsAppDragging(false)}
    >
      <div className="flex flex-col h-full text-white rounded-lg">
        {/* Notepad Header */}
        <div className="notepad-header application-header backdrop-blur-[5px] bg-[#202020] flex items-center justify-between rounded-tl-md rounded-tr-md">
          {/* Left side: Notepad Icon and Title */}
          <div className="flex items-center space-x-2 px-4 py-2">
            <img src="/windows/notepad.png" alt="Notepad Icon" className="w-5 h-5" />
            <span className='text-sm'>{title}</span>
          </div>

          {/* Right side: Minimize, Maximize, Close buttons */}
          <div className="flex items-center">
            <button className='h-10 w-10 hover:bg-[#383838]  flex items-center justify-center'>
                <MinimizeIcon />
            </button>
            <button className='h-10 w-10 hover:bg-[#383838]  flex items-center justify-center'>
                <MaximizeIcon />
            </button>
            <button className='h-10 w-10 hover:bg-[#a63b23] rounded-tr-md' onClick={onCloseNotepad}>
                <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between max-h-[32px] h-full p-2 bg-[#2c2c2c]">
          <div className="flex items-center space-x-4">
            <button className="ml-2 text-sm px-2 p-1 rounded-[2.5px] hover:bg-[#383838]">
              File
            </button>
            <button className="text-sm px-2 p-1 rounded-[2.5px] hover:bg-[#383838]">
              Edit
            </button>
            <button className="text-sm px-2 p-1 rounded-[2.5px] hover:bg-[#383838]">
              View
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          className="flex-grow bg-[#272727] p-4 resize-none focus:outline-none rounded-br-md rounded-bl-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder=""
          style={{ height: 'calc(100% - 40px)' }}
        />
      </div>
    </Rnd>
  );
};

export default Notepad;
