import { Link } from 'react-router-dom';
import LoginForm from '../components/login/LoginForm';

const Login = () => {
  return (
    <div className="relative overflow-hidden w-full min-h-screen flex flex-row bg-white dark:bg-gray-700">
      {/* 움직이는 화면 넣는 곳 */}
      <section className="w-1/2 h-screen hidden lg:block bg-slate-400 relative">
        <img src="https://picsum.photos/600/800" alt="" className="w-full h-full" />
        <p className="font-black text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[50px] ">
          Welcome
          <br />
          to
          <br />
          Defect
          <br />
          Studio
        </p>
      </section>

      {/* 로그인 영역 */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center text-black dark:text-white mb-6">
        <p className="text-3xl font-black text-center ">Welcome to Defect Studio</p>
        <p className="text-base text-center mb-6">
          <span className="text-basefont-bold">Don’t have an account? </span>

          <Link to="/signup">
            <span className="text-base font-black text-[#a490c0] hover:underline">Sign up for free</span>
          </Link>
        </p>

        <LoginForm />
      </section>
    </div>
  );
};

export default Login;
