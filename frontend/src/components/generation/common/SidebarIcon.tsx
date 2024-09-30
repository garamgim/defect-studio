import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { IconType } from 'react-icons';

interface SidebarIconProps {
  tabKey: keyof RootState['generatedOutput']; // 탭 키
  Icon: IconType; // React-Icons의 Icon 타입
  label: string;
  to: string;
}

const SidebarIcon = ({ tabKey, Icon, label, to }: SidebarIconProps) => {
  const { isLoading, isCheckedOutput } = useSelector((state: RootState) => {
    if (tabKey === 'clip') {
      return {};
    }
    return {
      isLoading: state.generatedOutput[tabKey].isLoading,
      isCheckedOutput: state.generatedOutput[tabKey].isCheckedOutput
    };
  });

  return (
    <Link
      to={to}
      className="relative flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
    >
      <Icon className="w-[20px] h-[20px] dark:text-slate-400" />
      <span className="flex text-[12px] mt-1 dark:text-slate-400">{label}</span>
      {(!isCheckedOutput || isLoading) && (
        <span className="absolute top-0 right-0 w-[10px] h-[10px] rounded-full bg-red-500 animate-ping"></span>
      )}
    </Link>
  );
};

export default SidebarIcon;
