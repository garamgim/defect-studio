import Loading from '../../assets/loading.gif';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <div className="relative">
        <div className="absolute top-0 w-32 h-32 left-0 right-0 bottom-0 m-auto rounded-full border-4 border-gray-100 dark:border-gray-800"></div>{' '}
        <div
          className="absolute top-0 w-32 h-32 left-0 right-0 bottom-0 m-auto rounded-full border-4 border-blue-500 animate-spin"
          style={{
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent'
          }}
        ></div>
        {/* GIF 캐릭터 */}
        <img src={Loading} alt="Loading" className="relative z-10 left-9 w-16" />
      </div>
    </div>
  );
};

export default LoadingIndicator;
