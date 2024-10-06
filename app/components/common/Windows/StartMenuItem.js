const StartMenuItem = ({ Name, IconSrc }) => {
    let hasBeenCreated = ['LinkedIn', 'Github', 'Notepad', 'Calculator', 'Minesweeper', 'Google Chrome'];
    let isCreated = hasBeenCreated.includes(Name) ? '' : 'bg-red-500';

    return (
        <div className={`p-4 ${isCreated} hover:bg-[#454649] rounded-[2.5px] cursor-pointer flex flex-col items-center px-6 transition duration-200 ease-in-out`}>
            <img src={IconSrc} alt={Name} className="w-8 h-8" />
            <span className="text-white text-sm mt-2 text-center">{Name}</span>
        </div>
    );
}

export default StartMenuItem;
