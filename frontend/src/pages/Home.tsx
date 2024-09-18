import AIToolBoxList from '../components/home/AIToolBoxList';
import Header from '../components/home/Header';
import { setAuthorizationToken } from '../api/token/axiosInstance';

const Home = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800">
      <header>
        <Header />
      </header>
      <button className="bg-red-300 px-4 py-2" onClick={() => setAuthorizationToken()}>
        토큰 재발급
      </button>
      <main>
        <p className="mt-8 md:mt-16 text-2xl font-bold text-black text-center md:text-left md:ml-10 dark:text-gray-300">
          Defect Studio’s AI Tools
        </p>

        <AIToolBoxList />
      </main>
    </div>
  );
};

export default Home;
