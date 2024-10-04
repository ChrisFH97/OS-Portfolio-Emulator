// Minesweeper.js
'use client';
import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import CloseIcon from '../../common/Windows/Icons/Close';
import MaximizeIcon from '../../common/Windows/Icons/Maximize';
import MinimizeIcon from '../../common/Windows/Icons/Minimize';

const GRID_SIZE = 10;
const MINE_COUNT = 20;

const Minesweeper = ({ setIsAppDragging, onCloseMinesweeper, isMinimized, onMinimizeToggle }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: 261, height: 350 });
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [closing, setClosing] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [grid, setGrid] = useState([]);
  const [mineLocations, setMineLocations] = useState(new Set());
  const [revealed, setRevealed] = useState(new Set());
  const [flagged, setFlagged] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
    setFadeIn(true);
  }, []);

  const initializeGame = () => {
    const mines = new Set();
    while (mines.size < MINE_COUNT) {
      mines.add(Math.floor(Math.random() * GRID_SIZE * GRID_SIZE));
    }
    setMineLocations(mines);
    setGrid(createGrid(mines));
    setRevealed(new Set());
    setFlagged(new Set());
    setGameOver(false);
    setGameWon(false);
  };

  const createGrid = (mines) => {
    const grid = Array(GRID_SIZE * GRID_SIZE).fill(0);
    for (let i = 0; i < grid.length; i++) {
      if (mines.has(i)) {
        grid[i] = 'M';
      }
    }
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] === 'M') continue;
      grid[i] = countAdjacentMines(i, mines);
    }
    return grid;
  };

  const countAdjacentMines = (index, mines) => {
    const adjacent = getAdjacentIndices(index);
    return adjacent.reduce((count, i) => (mines.has(i) ? count + 1 : count), 0);
  };

  const getAdjacentIndices = (index) => {
    const indices = [];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
          indices.push(newRow * GRID_SIZE + newCol);
        }
      }
    }
    return indices;
  };

  const revealTile = (index) => {
    if (gameOver || gameWon || revealed.has(index) || flagged.has(index)) return;

    const newRevealed = new Set(revealed);
    const queue = [index];

    while (queue.length > 0) {
      const current = queue.shift();
      if (newRevealed.has(current) || flagged.has(current)) continue;

      newRevealed.add(current);

      if (grid[current] === 0) {
        const adjacentIndices = getAdjacentIndices(current);
        adjacentIndices.forEach((adjIndex) => {
          if (!newRevealed.has(adjIndex) && !flagged.has(adjIndex)) {
            queue.push(adjIndex);
          }
        });
      }
    }

    if (mineLocations.has(index)) {
      setGameOver(true);
      revealAllTiles(newRevealed);
      return;
    }

    setRevealed(newRevealed);

    if (newRevealed.size + MINE_COUNT === GRID_SIZE * GRID_SIZE) {
      setGameWon(true);
      revealAllMines(newRevealed);
    }
  };

  const revealAllTiles = (newRevealed) => {
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      newRevealed.add(i);
    }
    setRevealed(newRevealed);
  };

  const revealAllMines = (newRevealed) => {
    mineLocations.forEach((mine) => {
      newRevealed.add(mine);
    });
    setRevealed(newRevealed);
  };

  const toggleFlag = (e, index) => {
    e.preventDefault();
    if (gameOver || gameWon || revealed.has(index)) return;
    const newFlagged = new Set(flagged);
    if (flagged.has(index)) {
      newFlagged.delete(index);
    } else {
      newFlagged.add(index);
    }
    setFlagged(newFlagged);
  };

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
      setSize({ width: 261, height: 400 });
      setPosition({ x: 50, y: 50 });
    } else {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onCloseMinesweeper, 300);
  };

  const handleMinimize = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onMinimizeToggle();
      setIsFadingOut(false);
    }, 300);
  };

  return (
    <div style={{ visibility: isMinimized ? 'hidden' : 'visible' }} className={`transition-opacity duration-300 ${isMinimized ? 'opacity-0' : 'opacity-100'}`}>
      <Rnd
        size={size}
        position={position}
        onResize={handleResize}
        onDrag={handleDrag}
        minWidth={261}
        maxWidth={261}
        minHeight={350}
        maxHeight={350}
        bounds="window"
        className={`rounded-lg shadow-lg transition-opacity duration-300 ${closing || isFadingOut ? 'opacity-0' : fadeIn ? 'opacity-100' : 'opacity-0'}`}
        dragHandleClassName="application-header"
        onDragStart={() => setIsAppDragging(true)}
        onDragStop={() => setIsAppDragging(false)}
        onResizeStart={() => setIsAppDragging(true)}
        onResizeStop={() => setIsAppDragging(false)}
        enableResizing={!isMaximized}
      >
        <div className="flex flex-col h-full text-white rounded-lg bg-app-background">
          <div className="application-header backdrop-blur-[5px] bg-[#202020] flex items-center justify-between rounded-tl-md rounded-tr-md">
            <div className="flex items-center space-x-2 px-4 py-2">
              <img src="/windows/minesweeper.png" alt="Minesweeper Icon" className="w-5 h-5" />
              <span className="text-sm">Minesweeper</span>
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
          <div className="flex items-center justify-between bg-[#1c1c1c] p-2">
            <button onClick={initializeGame} className='flex text-xs items-center'>
              <img src="/windows/minesweeper-smiley.png" alt="Reset" className="w-8 h-8 mr-1" /> Reset
            </button>
            <div className="text-xl font-mono text-red-600">{GRID_SIZE * GRID_SIZE - revealed.size - flagged.size}</div>
          </div>
          <div className="flex justify-center items-center p-[5px] rounded-lg">
            <div className="grid grid-cols-10 grid-rows-10 gap-[1px]">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => revealTile(i)}
                  onContextMenu={(e) => toggleFlag(e, i)}
                  className={`w-6 h-6 flex items-center justify-center cursor-pointer font-bold text-xs ${revealed.has(i) ? 'bg-[#4144a3]' : 'bg-[#666]'}`}
                >
                  {revealed.has(i) && (grid[i] === 'M' ? '💣' : grid[i] || '')}
                  {flagged.has(i) && !revealed.has(i) && '🚩'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default Minesweeper;
