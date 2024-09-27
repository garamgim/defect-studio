import React, { useEffect, useState } from 'react';

interface EmailVerifyingProps {
  email: string;
  setSignUpPage: React.Dispatch<React.SetStateAction<'FormPage' | 'Verifying Page'>>;
}

const EmailVerifying = ({ email, setSignUpPage }: EmailVerifyingProps) => {
  const [inputCode, SetInputCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(170); // 2분 50초는 170초
  const [timeout, setTimeoutState] = useState(false);
  const [canResend, setCanResend] = useState(false); // "Resend Code" 버튼 활성화 상태

  useEffect(() => {
    // 타이머가 0이 될 때까지 매 초마다 timeLeft를 감소
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setTimeoutState(true); // 시간이 0이 되면 timeout 상태를 true로 설정합니다.
    }
  }, [timeLeft]);

  useEffect(() => {
    // 컴포넌트가 마운트되면 10초 후에 "Resend Code" 버튼을 활성화합니다.
    const timer = setTimeout(() => {
      setCanResend(true);
    }, 10000); // 10초

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
  }, []);

  const handleResendCode = () => {
    setTimeLeft(180); // 제한 시간을 180초로 재설정
    setCanResend(false); // "Resend Code" 버튼을 다시 비활성화
    // 여기에 코드 재전송 로직 추가
  };

  return (
    <div className="flex flex-col items-center align-middle mt-[120px] mb-10 font-samsung  text-black dark:text-white">
      <header className="mb-5 flex flex-col w-[500px] justify-center align-middle items-center">
        <p className="text-[20px] font-bold">Email Verifying : {email}</p>

        <p className="text-center">
          A verification code has been sent to your email. Please check your email and enter the received code.
        </p>
      </header>

      <section>
        <input
          onChange={(e) => {
            if (e.target.value.length === 0) {
              SetInputCode('');
            } else {
              SetInputCode(e.target.value);
            }
          }}
          value={inputCode}
          type="text"
          placeholder="Enter the code"
          className=" mt-1 mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[400px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <p className="text-right font-bold">
          {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
        </p>
      </section>
      <section className="mt-5 flex flex-row justify-between w-[400px] ">
        <button
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-800 dark:focus:ring-blue-400 active:scale-95 transition transform duration-150 ease-in-out"
          onClick={() => setSignUpPage('FormPage')}
        >
          Back To Form
        </button>
        <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-600 dark:hover:bg-green-800 dark:focus:ring-green-400 active:scale-95 transition transform duration-150 ease-in-out">
          Check
        </button>
        <button
          disabled={!canResend}
          onClick={handleResendCode}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-600 dark:hover:bg-red-800 dark:focus:ring-red-400 active:scale-95 transition transform duration-150 ease-in-out"
        >
          Resend Code
        </button>
      </section>
    </div>
  );
};

export default EmailVerifying;
