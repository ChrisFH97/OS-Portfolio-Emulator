'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import CloseIcon from '../../common/Windows/Icons/Close';
import MaximizeIcon from '../../common/Windows/Icons/Maximize';
import MinimizeIcon from '../../common/Windows/Icons/Minimize';

const Calculator = ({ setIsAppDragging, onCloseCalculator, isMinimized, onMinimizeToggle }) => {
  const [title] = useState('Calculator');
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: 300, height: 510 });
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [previousSize, setPreviousSize] = useState(size);
  const [previousPosition, setPreviousPosition] = useState(position);
  const [closing, setClosing] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const rndRef = useRef(null);

  useEffect(() => setFadeIn(true), []);

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
    const rndElement = rndRef.current?.resizableElement.current;
    if (rndElement) rndElement.style.transition = 'all 0.3s ease';

    if (isMaximized) {
      setSize(previousSize);
      setPosition(previousPosition);
    } else {
      setPreviousSize(size);
      setPreviousPosition(position);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }

    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onCloseCalculator, 300);
  };

  const handleMinimize = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onMinimizeToggle();
      setIsFadingOut(false);
    }, 300);
  };

  const handleButtonClick = (value) => {
    if (!isNaN(value)) {
      handleNumber(value);
    } else if (value === 'C') {
      handleClear();
    } else if (value === 'CE') {
      handleClearEntry();
    } else if (value === '←') {
      handleBackspace();
    } else if (value === '=') {
      handleEquals();
    } else if (value === '±') {
      handleToggleSign();
    } else if (value === '.') {
      handleDecimal();
    } else if (value === '1/x') {
      handleReciprocal();
    } else if (value === 'x²') {
      handleSquare();
    } else if (value === '²√x') {
      handleSquareRoot();
    } else {
      handleOperator(value);
    }
  };

  const handleNumber = (number) => {
    if (waitingForNewValue) {
      setDisplayValue(number);
      setWaitingForNewValue(false);
    } else {
      setDisplayValue(displayValue === '0' ? number : displayValue + number);
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setPreviousValue(null);
    setWaitingForNewValue(false);
  };

  const handleClearEntry = () => {
    setDisplayValue('0');
  };

  const handleBackspace = () => {
    setDisplayValue(displayValue.length > 1 ? displayValue.slice(0, -1) : '0');
  };

  const handleEquals = () => {
    if (operator && previousValue !== null) {
      const current = parseFloat(displayValue);
      const previous = parseFloat(previousValue);
      let result;

      switch (operator) {
        case '+':
          result = previous + current;
          break;
        case '-':
          result = previous - current;
          break;
        case 'X':
          result = previous * current;
          break;
        case '/':
          result = current !== 0 ? previous / current : 'Error';
          break;
        default:
          return;
      }

      setDisplayValue(result.toString());
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handleOperator = (nextOperator) => {
    const currentValue = parseFloat(displayValue);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operator) {
      const result = performOperation(previousValue, currentValue, operator);
      setDisplayValue(result.toString());
      setPreviousValue(result);
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const performOperation = (firstValue, secondValue, operator) => {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case 'X':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 'Error';
      default:
        return secondValue;
    }
  };

  const handleDecimal = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleToggleSign = () => {
    setDisplayValue((prev) => (prev.charAt(0) === '-' ? prev.slice(1) : '-' + prev));
  };

  const handleSquare = () => {
    setDisplayValue((prev) => (parseFloat(prev) ** 2).toString());
  };

  const handleSquareRoot = () => {
    setDisplayValue((prev) => (Math.sqrt(parseFloat(prev))).toString());
  };

  const handleReciprocal = () => {
    setDisplayValue((prev) => (1 / parseFloat(prev)).toString());
  };

  const buttonStyles = (label) => {
    let baseStyle = 'p-4 text-lg text-white rounded text-md flex items-center justify-center';

    if (!isNaN(label) || label === '.' || label === '±') {
      baseStyle += ' bg-[#3b3b3b] hover:bg-[#3a3a3a]';
    } else if (label === '=') {
      baseStyle += ' bg-[#f38064] text-black';
    } else if (label === '←') {
      baseStyle += ' bg-[#323232]'; // Static color for backspace
    } else {
      baseStyle += ' bg-[#323232] hover:bg-[#3a3a3a]';
    }

    return baseStyle;
  };

  const buttonImageStyles = (label) => {
    const imageButtons = {
      '±': '/windows/calculator-plus-minus.png',
      '←': '/windows/calculator-delete.png',
      '²√x': '/windows/calculator-root.png',
      'x²': '/windows/calculator-sqaured.png',
      '1/x': '/windows/calculator-reciprocal.png',
    };

    const size = label === '²√x' || label === 'x²' ? '20px 16px' : '16px 16px';

    if (imageButtons[label]) {
      return {
        backgroundImage: `url(${imageButtons[label]})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: size, // Custom size for square and square root buttons
        color: 'transparent', // Hide text if image is used
      };
    }

    return {};
  };

  if (isMinimized) return null;

  return (
    <Rnd
      ref={rndRef}
      size={size}
      position={position}
      onResize={handleResize}
      onDrag={handleDrag}
      minWidth={300}
      minHeight={470}
      maxHeight={470}
      maxWidth={300}
      bounds="window"
      className={`rounded-lg shadow-lg calculator-window transition-opacity duration-300 ${
        closing || isFadingOut ? 'opacity-0' : fadeIn ? 'opacity-100' : 'opacity-0'
      } ${isMaximized ? 'transition-all duration-300' : ''}`}
      dragHandleClassName="application-header"
      onDragStart={() => setIsAppDragging(true)}
      onDragStop={() => setIsAppDragging(false)}
      onResizeStart={() => setIsAppDragging(true)}
      onResizeStop={() => setIsAppDragging(false)}
      enableResizing={!isMaximized}
    >
      <div className="flex flex-col h-full text-white rounded-lg bg-calculator-background">
        {/* Calculator Header */}
        <div className="calculator-header application-header backdrop-blur-[5px] bg-calculator-background flex items-center justify-between rounded-tl-md rounded-tr-md">
          <div className="flex items-center space-x-2 px-4 py-2">
            <img src="/windows/calculator.png" alt="Calculator Icon" className="w-5 h-5" />
            <span className="text-sm">{title}</span>
          </div>
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

        {/* Previous Value Display */}
        <div className="bg-calculator-background px-5 text-right text-white opacity-70 text-sm h-0">
          {previousValue && operator ? `${previousValue} ${operator}` : ''}
        </div>

        {/* Calculator Display */}
        <div
          className="bg-calculator-background p-4 flex items-center justify-end text-white font-light rounded-tl-md rounded-tr-md h-20"
          style={{
            fontSize:
              displayValue.length > 10
                ? '1.5rem' // Shrinks when length > 10
                : displayValue.length > 6
                ? '2.5rem' // Medium size for length > 6
                : '2.5rem', // Default size
          }}
        >
          {displayValue}
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-1 p-2">
          {['%', 'CE', 'C', '←', '1/x', 'x²', '²√x', '/', 7, 8, 9, 'X', 4, 5, 6, '-', 1, 2, 3, '+', '±', 0, '.', '='].map(
            (label, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(label.toString())}
                className={buttonStyles(label) + ' text-sm rounded-[2.5px]'}
                style={buttonImageStyles(label)} // Apply image styles where appropriate
              >
                {(!['±', '←', '²√x', 'x²'].includes(label)) && label} {/* Hide text for image buttons */}
              </button>
            )
          )}
        </div>
      </div>
    </Rnd>
  );
};

export default Calculator;
