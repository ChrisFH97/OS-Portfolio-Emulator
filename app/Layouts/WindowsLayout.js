import Desktop from "../components/windows/Desktop";
import WindowsTaskbar from "../components/windows/Taskbar";
import '../styles/globals.css';
import { useState } from 'react';

const WindowsLayout = () => {
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);  // Notepad state

  const openNotepad = () => {
    setIsNotepadOpen(true);
  };

  const closeNotepad = () => {
    setIsNotepadOpen(false);
  };

  return (
    <div className="windows-layout fixed">
      <Desktop 
        isNotepadOpen={isNotepadOpen} 
        openNotepad={openNotepad} 
        closeNotepad={closeNotepad} 
      />
      <WindowsTaskbar openNotepad={openNotepad} />  {/* Pass the function to the taskbar */}
    </div>
  );
};

export default WindowsLayout;
