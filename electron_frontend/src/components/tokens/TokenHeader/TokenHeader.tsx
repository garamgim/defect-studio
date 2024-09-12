import './TokenHeader.css';

const TokenHeader = () => {
  return (
    <header>
      <h1 className="text-[30px] font-bold mb-2 dark:text-gray-300">Tokens</h1>
      <p className="text-[20px] mb-2 dark:text-gray-300">Your Authority : {}</p>
    </header>
  );
};

export default TokenHeader;
