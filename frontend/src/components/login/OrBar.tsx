const OrBar = () => {
  return (
    <div className="w-[350px] h-[37px] my-5 relative">
      <svg
        width={350}
        height={1}
        viewBox="0 0 350 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-[-1px] top-4"
        preserveAspectRatio="none"
      >
        <line y1="0.5" x2={350} y2="0.5" stroke="#CCCCCC" />
      </svg>
      <div className="w-[53px] h-[37px] absolute left-[147px] top-[-1px] bg-white" />
      <p className="absolute left-[161px] top-[5px] text-base text-left text-[#696969]">OR</p>
    </div>
  );
};

export default OrBar;
