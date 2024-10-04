'use client';
import React, { useState, useEffect } from 'react';
import Notepad from './Applications/Notepad';
import Calculator from './Applications/Calculator';
import Minesweeper from './Applications/Minesweeper';

const Desktop = ({ apps, closeApp, toggleMinimizeApp }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [isAppDragging, setIsAppDragging] = useState(false);

  const handleMouseDown = (e) => {
    if (!isAppDragging && e.target.className !== 'application-header') {
      setIsDragging(true);
      setStartPosition({ x: e.clientX, y: e.clientY });
      setCurrentPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setCurrentPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getSelectionBoxStyle = () => {
    if (!isDragging || isAppDragging) return { display: 'none' };

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

  // Dynamically render apps based on their states
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

      {/* Render Notepad if it's open and not minimized */}
      {apps.find(app => app.name === 'Notepad')?.isOpen && !apps.find(app => app.name === 'Notepad')?.isMinimized && (
        <Notepad
          setIsAppDragging={setIsAppDragging}
          onCloseNotepad={() => closeApp('Notepad')}
          onMinimizeToggle={() => toggleMinimizeApp('Notepad')}
          isMinimized={apps.find(app => app.name === 'Notepad')?.isMinimized}
        />
      )}

      {/* Render Calculator if it's open and not minimized */}
      {apps.find(app => app.name === 'Calculator')?.isOpen && !apps.find(app => app.name === 'Calculator')?.isMinimized && (
        <Calculator
          setIsAppDragging={setIsAppDragging}
          onMinimizeToggle={() => toggleMinimizeApp('Calculator')}
          isMinimized={apps.find(app => app.name === 'Calculator')?.isMinimized}
          onCloseCalculator={() => closeApp('Calculator')}
        />
      )}

      {apps.find(app => app.name === 'Minesweeper')?.isOpen && !apps.find(app => app.name === 'Minesweeper')?.isMinimized && (
        <Minesweeper 
          setIsAppDragging={setIsAppDragging}
          onMinimizeToggle={() => toggleMinimizeApp('Minesweeper')}
          isMinimized={apps.find(app => app.name === 'Minesweeper')?.isMinimized}
          onCloseMinesweeper={() => closeApp('Minesweeper')}
        />
      )}

    </div>
  );
};

export default Desktop;
