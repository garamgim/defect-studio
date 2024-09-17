import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { setLevel, LevelState } from '../../store/slices/levelSlice';
import { toggleMode } from '../../store/slices/themeSlice';
import logo from '../../assets/logo.png';
import token from '../../assets/token.png';
import { Dropdown, Button, Switch } from 'antd';
import type { MenuProps } from 'antd';
import { useGetMyInfo } from '../../api/user';

import MiniProfile from '../profile/MiniProfile';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const level = useSelector((state: RootState) => state.level);
  const mode = useSelector((state: RootState) => state.theme.mode);

  // 로그인 여부 확인 (로컬 스토리지에서 토큰 확인)
  // const isLoggedIn = !!localStorage.getItem('accessToken');
  const isLoggedIn = true;

  const selectLevel = (selectedLevel: LevelState) => {
    dispatch(setLevel(selectedLevel));
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const generationItems: MenuProps['items'] = [
    {
      label: 'Text To Image',
      key: 'text-to-image',
      onClick: () => navigateTo('/generation/text-to-image')
    },
    {
      label: 'Image To Image',
      key: 'image-to-image',
      onClick: () => navigateTo('/generation/image-to-image')
    },
    {
      label: 'Inpainting',
      key: 'inpainting',
      onClick: () => navigateTo('/generation/inpainting')
    },
    {
      label: 'Remove Background',
      key: 'remove-bg',
      onClick: () => navigateTo('/generation/remove-background')
    },
    {
      label: 'Cleanup',
      key: 'cleanup',
      onClick: () => navigateTo('/generation/cleanup')
    }
  ];

  const levelItems: MenuProps['items'] = [
    { label: 'Basic', key: 'basic', onClick: () => selectLevel('Basic') },
    {
      label: 'Advanced',
      key: 'advanced',
      onClick: () => selectLevel('Advanced')
    }
  ];

  const { myInfo } = useGetMyInfo({ isLoggedIn });

  return (
    <div className="fixed z-20 w-full h-[60px] flex items-center px-10 bg-white border-b border-gray-300 dark:bg-gray-800 dark:border-none">
      <div className="flex items-center">
        <img
          src={logo}
          className="w-[30px] h-[30px] mr-2 object-cover cursor-pointer"
          alt="logo"
          onClick={() => navigateTo('/')}
        />
        <p
          className="text-xl font-bold text-[#1428a0] dark:text-gray-200 font-samsung cursor-pointer"
          onClick={() => navigateTo('/')}
        >
          Defect Studio
        </p>
      </div>

      {/* 로그인 한 경우에만 메뉴 탭 보여줌 */}
      {isLoggedIn && (
        <div className="hidden md:flex ml-20 space-x-4">
          <Dropdown menu={{ items: generationItems }} trigger={['hover']}>
            <Button type="link" className="text-base text-black dark:text-gray-300 cursor-pointer">
              Generation
            </Button>
          </Dropdown>
          <Button
            type="link"
            className="text-base text-black dark:text-gray-300 cursor-pointer"
            onClick={() => navigateTo('/training')}
          >
            Training
          </Button>
          <Button
            type="link"
            className="text-base text-black dark:text-gray-300 cursor-pointer"
            onClick={() => navigateTo('/model')}
          >
            Model
          </Button>
          <Button
            type="link"
            className="text-base text-black dark:text-gray-300 cursor-pointer"
            onClick={() => navigateTo('/settings')}
          >
            Settings
          </Button>
          <Button
            type="link"
            className="text-base text-black dark:text-gray-300 cursor-pointer"
            onClick={() => navigateTo('/tokens')}
          >
            Tokens
          </Button>
        </div>
      )}

      <div className="flex ml-auto items-center space-x-4">
        {isLoggedIn && myInfo ? (
          <>
            <div className="flex items-center">
              <img src={token} className="w-[25px] h-[25px] object-contain" alt="token" />
              <p className="ml-2 text-base font-bold text-black dark:text-gray-300">{myInfo.token_quantity}</p>
            </div>
            <Dropdown
              overlay={
                <MiniProfile
                  nickname={myInfo.nickname}
                  department_name={myInfo.department_name}
                  email={myInfo.email}
                  member_pk={myInfo.member_pk}
                />
              }
              trigger={['hover']}
            >
              <a className="dark:text-white text-gray-800" onClick={(e) => e.preventDefault()}>
                {myInfo.nickname}
              </a>
            </Dropdown>

            <Dropdown menu={{ items: levelItems }} trigger={['hover']}>
              <Button
                type="link"
                className="flex items-center justify-between text-base text-black dark:text-gray-300 cursor-pointer"
                style={{ width: '100px' }}
              >
                <span>{level}</span>
              </Button>
            </Dropdown>
          </>
        ) : (
          <div>
            <Button
              onClick={() => {
                navigate('/login');
              }}
              className="dark:bg-slate-400 dark:text-white gray-50"
            >
              Login
            </Button>{' '}
            {/* 로그인 버튼 */}
          </div>
        )}
        <Switch
          checked={mode === 'dark'}
          onChange={() => dispatch(toggleMode())}
          checkedChildren="dark"
          unCheckedChildren="light"
        />
      </div>
    </div>
  );
};

export default Navbar;
