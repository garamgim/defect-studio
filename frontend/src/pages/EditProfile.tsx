import { useNavigate } from 'react-router-dom';
import { useGetMyInfo } from '@hooks/user/useGetMyInfo';

import { useForm } from 'react-hook-form';
import { editProfile, upDateMyInfo } from '../api/user';
import { message } from 'antd';

const EditProfile = () => {
  // 자기 정보 가져오기
  const { myInfo, myInfoPending, isGetMyInfoError, myInfoError } = useGetMyInfo({
    isLoggedIn: !!localStorage.getItem('accessToken')
  });
  const navigate = useNavigate();

  interface EditProfileInputs {
    email: string;
    nickname: string;
  }

  // 폼 관리
  const {
    handleSubmit, // form onSubmit에 들어가는 함수
    register, // onChange 등의 이벤트 객체 생성
    formState: { errors, isValid, isSubmitting } // errors: register의 에러 메세지 자동 출력
  } = useForm<EditProfileInputs>({ mode: 'onChange' });

  const onSubmit = async (data: EditProfileInputs) => {
    try {
      await editProfile(data);
      upDateMyInfo();
      navigate(-1);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Error editing profile:', error);
      message.error('Failed to update profile');
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
        <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full overflow-y-auto custom-scrollbar dark:bg-gray-600 dark:border-none text-black dark:text-white font-samsung">
          {myInfoPending && <p>Loading...</p>}
          {isGetMyInfoError && <p>Error: {myInfoError?.message}</p>}

          {/* 여기서부터 프로필 정보 가져오기 */}
          {myInfo && (
            <div>
              {/* 프로필 헤더 */}
              <p className="text-3xl text-left mb-8 font-bold">Edit Profile</p>

              {/* 폼 시작 */}
              <form
                onSubmit={handleSubmit((data) => {
                  onSubmit(data);
                })}
              >
                <div className="h-[120px] relative">
                  <p className="text-black dark:text-white text-[20px] font-bold font-samsung">Email</p>
                  <input
                    className={`w-full border-gray-300 border-[2px]  dark:border-none  dark:bg-gray-700 h-[40px] rounded-[8px] p-[10px] focus:outline-none ${errors?.email && 'border-red-500 border-[2px]'}`}
                    type="email"
                    placeholder="Email"
                    defaultValue={myInfo.email}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format'
                      }
                    })}
                  />
                  {errors?.email?.type === 'required' && (
                    <p className="text-red-500 font-bold">Please enter your email</p>
                  )}
                  {errors?.email?.type === 'pattern' && (
                    <p className="text-red-500 font-bold">Please enter a valid email format</p>
                  )}
                </div>
                <div className="h-[120px] relative">
                  <p className="text-black dark:text-white text-[20px] font-bold font-samsung">Nickname</p>
                  <input
                    className={`w-full border-gray-300 border-[2px]  dark:border-none  dark:bg-gray-700 h-[40px] rounded-[8px] p-[10px] focus:outline-none ${errors?.nickname && 'border-red-500 border-[2px]'}`}
                    type="text"
                    placeholder="Nickname"
                    defaultValue={myInfo.nickname}
                    {...register('nickname', {
                      required: 'Nickname is required',
                      minLength: {
                        value: 3,
                        message: 'Nickname must be at least 3 characters'
                      },
                      maxLength: {
                        value: 15,
                        message: 'Nickname must be no more than 15 characters'
                      },
                      pattern: {
                        value: /^[가-힣a-zA-Z0-9_]+$/,
                        message: 'Nickname can only include letters, numbers, and underscores'
                      }
                    })}
                  />
                  {errors?.nickname?.type === 'required' && (
                    <p className="text-red-500 font-bold">Nickname is required</p>
                  )}
                  {errors?.nickname?.type === 'minLength' && (
                    <p className="text-red-500 font-bold">Nickname must be at least 3 characters</p>
                  )}
                  {errors?.nickname?.type === 'maxLength' && (
                    <p className="text-red-500 font-bold">Nickname must be no more than 15 characters</p>
                  )}
                  {errors?.nickname?.type === 'pattern' && (
                    <p className="text-red-500 font-bold">
                      Nickname can only include letters, numbers, and underscores
                    </p>
                  )}
                </div>
                <section className="w-full flex flex-row justify-end">
                  {isSubmitting ? (
                    <p>Loading...</p>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(-1);
                        }}
                        className="font-samsung font-bold ms-10  hover:scale-105 active:scale-95 transition-transform"
                      >
                        Back(Cancel)
                      </button>
                      <button
                        disabled={!isValid}
                        type="submit"
                        className={`font-samsung font-bold ms-10 ${!isValid && 'text-red-300'} hover:scale-105 active:scale-95 transition-transform`}
                      >
                        {isValid ? 'Save' : 'Plaese Check the Form'}
                      </button>
                    </div>
                  )}
                </section>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
