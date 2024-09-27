import { useState } from 'react';
import { signUpFormType } from '../types/user';
import SignupForm from '@components/signup/SignupForm';
import EmailVerifying from '@components/signup/EmailVerifying';

const signupData: signUpFormType = {
  login_id: '',
  password: '',
  name: '',
  nickname: '',
  email: '',
  department_id: 0
};

const Signup = () => {
  const [signupForm, setSignupForm] = useState<signUpFormType>(signupData);
  const [signUpPage, setSignUpPage] = useState<'FormPage' | 'Verifying Page'>(`FormPage`);

  return (
    <div className="w-full h-full min-h-[calc(100vh-60px)] relative overflow-hidden bg-white dark:bg-gray-800">
      <p className="absolute left-1/2 top-8 transform -translate-x-1/2 text-2xl sm:text-3xl font-black text-center text-black dark:text-white">
        Welcome to Defect Studio
      </p>
      <div
        className={`transition-opacity duration-500 ${signUpPage === 'FormPage' ? 'opacity-100' : 'opacity-0'} transform scale-95`}
      >
        {signUpPage === 'FormPage' && (
          <SignupForm signupForm={signupForm} setSignupForm={setSignupForm} setSignUpPage={setSignUpPage} />
        )}
      </div>
      <div
        className={`transition-opacity duration-500 ${signUpPage === 'Verifying Page' ? 'opacity-100' : 'opacity-0'} transform scale-95`}
      >
        {signUpPage === 'Verifying Page' && <EmailVerifying email={signupForm.email} setSignUpPage={setSignUpPage} />}
      </div>
    </div>
  );
};

export default Signup;
