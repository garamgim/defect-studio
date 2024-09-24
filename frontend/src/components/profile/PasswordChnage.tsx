import { useForm } from 'react-hook-form';
import { editProfile } from '../../api/user';
import { message } from 'antd';
interface PasswordUpdate {
  newPassword: string;
  newPasswordConfirm: string;
}

interface PasswordChnageProps {
  // props here
  onClose: () => void;
}

const PasswordChnage = ({ onClose }: PasswordChnageProps) => {
  const {
    handleSubmit, // form onSubmit에 들어가는 함수
    register,
    watch, // onChange 등의 이벤트 객체 생성
    formState: { errors, isValid, isSubmitting } // errors: register의 에러 메세지 자동 출력
  } = useForm<PasswordUpdate>({ mode: 'onChange' });
  const newPassword = watch('newPassword');

  const onSubmit = async (data: PasswordUpdate) => {
    const submitData = { password: data.newPassword };
    try {
      await editProfile(submitData);
      message.success('Password changed successfully');
      onClose();
    } catch (error) {
      message.error('Failed to change password');
    }
  };

  return (
    <div className="flex flex-col">
      <h4 className="text-[20px] font-bold">Change Password</h4>
      <form action="">
        <div className="h-[90px] mt-3">
          <label htmlFor="newPasswordInput">New Password</label>
          <input
            id="newPasswordInput"
            type="password"
            className="w-full h-10 rounded px-3 mt-1 text-[#222222] dark:bg-gray-800 dark:text-white"
            {...register('newPassword', {
              required: 'Enter new Password Please',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long.'
              },
              maxLength: {
                value: 20,
                message: 'Password must be at most 20 characters long.'
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
                message: 'Password must include at least one letter and one number.'
              }
            })}
          />
          {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
        </div>
        <div className="h-[90px] mt-3">
          <label htmlFor="newPasswordConfirm">Confirm New Password</label>
          <input
            id="newPasswordConfirm"
            type="password"
            className="w-full h-10 rounded px-3 mt-1 text-[#222222] dark:bg-gray-800 dark:text-white"
            {...register('newPasswordConfirm', {
              validate: (value) => value === newPassword || 'The passwords do not match.'
            })}
          />
          {errors.newPasswordConfirm && <p className="text-red-500">{errors.newPasswordConfirm.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full h-10 rounded mt-3 text-black dark:text-white hover:scale-105 transform transition duration-100 ease-in-out active:scale-95"
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting ? 'Loading...' : isValid ? 'Change Password' : 'Fill the form'}
        </button>
      </form>
    </div>
  );
};

export default PasswordChnage;
