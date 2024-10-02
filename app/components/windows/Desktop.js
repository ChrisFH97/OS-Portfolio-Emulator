'use client';
import React, { useState } from 'react';

const Desktop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    setStartPosition({ x: startX, y: startY });
    setCurrentPosition({ x: startX, y: startY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    setCurrentPosition({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getSelectionBoxStyle = () => {
    if (!isDragging) return { display: 'none' };

    const width = Math.abs(currentPosition.x - startPosition.x);
    const height = Math.abs(currentPosition.y - startPosition.y);
    const left = Math.min(currentPosition.x, startPosition.x);
    const top = Math.min(currentPosition.y, startPosition.y);

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      display: 'block',
    };
  };

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/windows/bg-windows.jpg')` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="absolute border border-blue-500 bg-blue-500/30 pointer-events-none"
        style={getSelectionBoxStyle()}
      ></div>

      {/* Desktop icons and other elements */}
      <div className="absolute top-[50px] left-[50px]">
   
      </div>
    </div>
  );
};

export default Desktop;
