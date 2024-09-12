import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../api/getUserInfo';
import { useEffect } from 'react';
import { logout } from '../../api/user';
interface miniProfilePropsType {
  nickname: string;
  department_name: string;
  email: string;
  member_pk: number;
}

const MiniProfile = ({ nickname, department_name, email, member_pk }: miniProfilePropsType) => {
  const navigate = useNavigate();
  useEffect(() => {
    const testfunc = async () => {
      try {
        const response = await getUserInfo();
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    };
    testfunc();
  });

  return (
    <>
      <div className="w-[300px] h-[180px] relative">
        <div
          className="w-[300px] h-[180px] absolute left-[-1px] top-[-1px] rounded-[10px] bg-white border border-[#e0e0e0]"
          style={{ boxShadow: '0px 4px 4px 0 rgba(0,0,0,0.25)' }}
        />
        {member_pk}
        <section className="flex flex-col items-center justify-center relative">
          <p className="text-base text-left text-black">{nickname}</p>
          <p className=" text-base text-left text-black">{department_name}</p>
          <p className=" text-sm text-left text-[#47415e]">{email}</p>
          <div className="w-[94px] h-[37px] absolute left-[38px] top-[100px]">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="btn w-[94px] h-[37px] absolute left-[-1px] top-[-1px] rounded-[10px] text-base bg-[#fd7272] hover:bg-[#f26a6a] text-white active:scale-95"
            >
              Log Out
            </button>
          </div>

          <div className="w-[94px] h-[37px] absolute left-[171px] top-[100px]">
            <button
              onClick={async () => {
                const response = await getUserInfo();
                console.log(response);
              }}
              className="btn w-[94px] h-[37px] absolute left-[-1px] top-[-1px] rounded-[10px] text-base bg-[#8a2be2] hover:bg-[#8226d9] text-white active:scale-95"
            >
              Detail
            </button>
          </div>
        </section>
      </div>
      ;
    </>
  );
};

export default MiniProfile;
