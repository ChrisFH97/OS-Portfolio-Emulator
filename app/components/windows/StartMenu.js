import { useState } from 'react';
import '../../styles/globals.css';
import localFont from 'next/font/local';
import StartMenuItem from '@/app/components/common/Windows/StartMenuItem';

const windowsFont = localFont({ src: '../../fonts/SegoeUIVF.ttf' });

const pinnedPrograms = [
  { name: "Google Chrome", icon: "/windows/chrome.png" },
  { name: "LinkedIn", icon: "/windows/linkedin.png" },
  { name: "Github", icon: "/windows/github.png" },
  { name: "Chris AI", icon: "/windows/copilot.png" },
  { name: "Minesweeper", icon: "/windows/minesweeper.png" },
  { name: "Calculator", icon: "/windows/calculator.png" }, // Used to open Calculator
  { name: "Notepad", icon: "/windows/notepad.png" },
  { name: "Spotify", icon: "/windows/spotify.png" },
];

const StartMenu = ({ onOpenApp }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrograms = pinnedPrograms.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProgramClick = (programName) => {
    onOpenApp(programName);
  };

  return (
    <div className={`start-menu w-[531px] flex flex-col h-[600px] backdrop-blur-[10px] bg-windows-start-menu ${windowsFont.className} rounded-xl`}>
      
      {/* Search Bar */}
      <div className="flex items-center justify-between p-4 px-6">
        <input 
          type="text" 
          placeholder="Search for apps, settings, and documents" 
          className="w-full py-2 px-6 rounded-full bg-[#242424] text-xs text-white placeholder-[#6e6e6f] focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Pinned Apps Section */}
      <div className="flex flex-col p-4 space-y-4 ">
        <div className="text-white text-sm px-8">Pinned</div>
        <div className="grid grid-cols-4 gap-3">
          {filteredPrograms.map((program, index) => (
            <div key={index} onClick={() => handleProgramClick(program.name)}>
              <StartMenuItem 
                Name={program.name} 
                IconSrc={program.icon} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
