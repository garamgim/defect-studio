import { useNavigate } from 'react-router-dom';

const MiniProfileLogin = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-[300px] h-[150px] relative">
        <div
          className="w-[300px] h-[150px] absolute left-[-1px] top-[-1px] rounded-[10px] bg-white border border-[#e0e0e0]"
          style={{ boxShadow: '0px 4px 4px 0 rgba(0,0,0,0.25)' }}
        />
        <p className="absolute left-[114px] top-[10px] text-base text-left text-black">Nickname</p>
        <p className="absolute left-[49px] top-[35px] text-base text-left text-black">Samsumg Electronic Co. DX</p>
        <p className="absolute left-[99px] top-[55px] text-sm text-left text-[#47415e]">ssafy@ssafy.com</p>
        <div className="w-[94px] h-[37px] absolute left-[38px] top-[100px]">
          <button
            onClick={() => {
              navigate('/login');
            }}
            className="btn w-[94px] h-[37px] absolute left-[-1px] top-[-1px] rounded-[10px] text-base bg-[#fd7272] hover:bg-[#f26a6a] text-white active:scale-95"
          >
            Log Out
          </button>
        </div>

        <div className="w-[94px] h-[37px] absolute left-[171px] top-[100px]">
          <button
            onClick={() => {
              navigate('/profile/test');
            }}
            className="btn w-[94px] h-[37px] absolute left-[-1px] top-[-1px] rounded-[10px] text-base bg-[#8a2be2] hover:bg-[#8226d9] text-white active:scale-95"
          >
            Detail
          </button>
        </div>
      </div>
      ;
    </>
  );
};

export default MiniProfileLogin;
