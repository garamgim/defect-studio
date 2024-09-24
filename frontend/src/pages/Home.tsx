import Header from '../components/home/Header';
import { setAuthorizationToken } from '../api/token/axiosInstance';

const Home = () => {
  return (
    <div className="h-[calc(100vh-60px)] bg-white dark:bg-gray-800">
      <header>
        <Header />
      </header>

      <main className="p-16">
        <p className="mt-4 mb-4 text-[24px] font-semibold dark:text-gray-300">Assets</p>
        <p className="mb-10 text-[18px] dark:text-gray-300">Browse and Utilize Your Custom-Generated Images</p>

        <div className="w-[360px] h-[360px] rounded-3xl bg-gray-300"></div>

      </main>
    </div>
  );
};

export default Home;
