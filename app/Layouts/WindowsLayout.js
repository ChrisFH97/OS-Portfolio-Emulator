import Desktop from "../components/windows/Desktop";
import WindowsTaskbar from "../components/windows/Taskbar";
import '../styles/globals.css';

const WindowsLayout = ({ children }) => {
    return (
      <div className="windows-layout">

        <main>{children}</main>
        <Desktop />
        <WindowsTaskbar />
      </div>
    );
  };
  
  export default WindowsLayout;
  