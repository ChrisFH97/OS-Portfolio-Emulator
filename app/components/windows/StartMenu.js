import { useState } from 'react';
import '../../styles/globals.css';
import localFont from 'next/font/local';
import StartMenuItem from '@/app/components/common/Windows/StartMenuItem';

// Font files can be colocated inside of `pages`
const windowsFont = localFont({ src: '../../fonts/SegoeUIVF.ttf' });

const pinnedPrograms = [
  { name: "Google Chrome", icon: "/windows/chrome.png" },
  { name: "LinkedIn", icon: "/windows/linkedin.png" },
  { name: "Github", icon: "/windows/github.png" },
  { name: "Chris AI", icon: "/windows/copilot.png" },
  { name: "Mine sweeper", icon: "/windows/minesweeper.png" },
  { name: "Calculator", icon: "/windows/calculator.png" },
  { name: "Notepad", icon: "/windows/notepad.png" },
  { name: "Spotify", icon: "/windows/spotify.png" },
];

const StartMenu = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  // Filter pinned programs based on the search term
  const filteredPrograms = pinnedPrograms.filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFakeShutDown = () => {
    // close the tab
    window.close();
}

  return (
    <div className={`start-menu w-[531px] flex flex-col h-[600px] backdrop-blur-[10px] bg-windows-start-menu ${windowsFont.className} rounded-xl`}>
      
      {/* Search Bar */}
      <div className="flex items-center justify-between p-4 px-6">
        <input 
          type="text" 
          placeholder="Search for apps, settings and documents" 
          className="w-full py-2 px-6 rounded-full bg-[#242424] text-xs text-white placeholder-[#6e6e6f] focus:outline-none"
          value={searchTerm} // Controlled input value
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </div>

      {/* Pinned Apps Section */}
      <div className="flex flex-col p-4 space-y-4 ">
        <div className="text-white text-sm px-8">Pinned</div>
        <div className="grid grid-cols-4 gap-3">
          {/* Display filtered programs */}
          {filteredPrograms.map((program, index) => (
            <StartMenuItem 
              key={index} 
              Name={program.name} 
              IconSrc={program.icon} 
            />
          ))}
        </div>
      </div>

      {/* Bottom Block */}
      <div className="mt-auto bg-[#222223] h-16 rounded-b-xl flex items-center justify-between px-4 ">
        <div className="ml-12 flex items-center hover:bg-[#2d2d2e] p-2 rounded-[2.5px] cursor-pointer">
          <img 
            src="/windows/profile.png" 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full" 
          />
          <span className="text-white text-sm pl-2">Chris</span>
        </div>
        <div>
          <button className="text-white text-xl mr-12 p-2.5 hover:bg-[#2d2d2e] rounded-[2.5px]" onClick={handleFakeShutDown}>
            <img src="/windows/Power.svg" alt="Power Icon" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
