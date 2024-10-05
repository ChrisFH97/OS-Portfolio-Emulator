'use client';
import React, { useState, useEffect, useRef } from 'react';
import Notepad from './Applications/Notepad';
import Calculator from './Applications/Calculator';
import Minesweeper from './Applications/Minesweeper';

const Desktop = ({ apps, closeApp, toggleMinimizeApp }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [isAppDragging, setIsAppDragging] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('/windows/bg-windows.jpg'); // Default background

  // Reference to the file input element
  const fileInputRef = useRef(null);

  // Load background image from local storage if available
  useEffect(() => {
    const storedBackground = localStorage.getItem('desktopBackground');
    if (storedBackground) {
      setBackgroundImage(storedBackground);
    }
  }, []);

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

  // Handle right-click on desktop to trigger image upload
  const handleRightClick = (e) => {
    // Make sure this only happens when right-clicking on the background
    if (e.target.classList.contains('desktop-background')) {
      e.preventDefault();
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Handle the file input change to upload an image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const image = new Image();
        image.src = event.target.result;
  
        image.onload = () => {
          // Resize the image
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
  
          let width = image.width;
          let height = image.height;
  
          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
  
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);
  
          // Convert the canvas to a base64 URL
          const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality for JPEG compression
  
          try {
            // Save the resized image to localStorage
            localStorage.setItem('desktopBackground', resizedImageUrl);
            setBackgroundImage(resizedImageUrl);
          } catch (err) {
            console.error('Error storing the image in localStorage:', err);
          }
        };
      };
  
      reader.readAsDataURL(file); // Convert the image file to a base64 URL
    }
  };

  // Dynamically render apps based on their states
  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center bg-no-repeat desktop-background" // Add class for background targeting
      style={{ backgroundImage: `url(${backgroundImage})` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleRightClick} // Trigger the right-click functionality only for the background
    >
      {/* Hidden file input to select the new background image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      <div
        className="absolute border border-blue-500 bg-blue-500/30 pointer-events-none"
        style={getSelectionBoxStyle()}
      ></div>

      {/* Render Notepad if it's open */}
      {apps.find(app => app.name === 'Notepad')?.isOpen && (
        <Notepad
          setIsAppDragging={setIsAppDragging}
          onCloseNotepad={() => closeApp('Notepad')}
          onMinimizeToggle={() => toggleMinimizeApp('Notepad')}
          isMinimized={apps.find(app => app.name === 'Notepad')?.isMinimized}
        />
      )}

      {/* Render Calculator if it's open */}
      {apps.find(app => app.name === 'Calculator')?.isOpen && (
        <Calculator
          setIsAppDragging={setIsAppDragging}
          onMinimizeToggle={() => toggleMinimizeApp('Calculator')}
          isMinimized={apps.find(app => app.name === 'Calculator')?.isMinimized}
          onCloseCalculator={() => closeApp('Calculator')}
        />
      )}

      {/* Render Minesweeper if it's open */}
      {apps.find(app => app.name === 'Minesweeper')?.isOpen && (
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
