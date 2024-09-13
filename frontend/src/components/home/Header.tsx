import HomeImg from '../../assets/homeImg.png';

const Header = () => {
  return (
    <div className="relative overflow-hidden flex items-center justify-center w-full h-[535px] bg-gray-300">
      <div className="absolute inset-0">
        <img src={HomeImg} alt="Background" className="w-full h-full object-cover z-0" />
      </div>
      <div className="relative text-center text-white p-4">
        <p
          className="text-[36px] font-bold mb-12 font-Gmarket typing-text"
          style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            lineHeight: '1.2', // Line height 조정

            paddingTop: '2px', // 상단 패딩 조정
            paddingBottom: '2px', // 하단 패딩 조정
          }}
        >
          Imagine, Create, and Innovate with Defect Studio
        </p>
        <div className="mt-6 relative w-full max-w-[750px] mx-auto">
          <div className="bg-white rounded-[20px] h-16 flex items-center justify-center w-full">
            <div className="relative flex justify-end items-center w-full h-full pr-5">
              <div className="bg-blue-700 rounded-full w-[134px] h-10 flex items-center justify-center absolute right-4">
                <img src={'./src/assets/sparkling.png'} alt="Sparkling" className="w-4 h-4 mr-2" />
                <p className="text-white font-bold">Generate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
