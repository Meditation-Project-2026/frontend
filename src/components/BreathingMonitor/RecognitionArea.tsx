const RecognitionArea: React.FC = () => {
  return (
    <section className="relative mb-12">
      <div className="relative w-72 h-72 mx-auto overflow-hidden rounded-[40px] border-4 border-[#45947D] shadow-2xl shadow-[#6BE6C1]/20">
        <img 
          alt="User face scan" 
          className="w-full h-full object-cover grayscale-[0.2]" 
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
        />
        <div className="absolute inset-x-4 top-1/2 h-0.5 bg-[#45947D] shadow-[0_0_15px_#6BE6C1] animate-pulse"></div>
        <div className="absolute inset-6 border-2 border-[#45947D]/40 rounded-3xl"></div>
      </div>
      <p className="text-center text-sm mt-6 text-[#45947D] dark:text-[#6BE6C1] font-semibold tracking-wide">
        안면 인식 유지 중...
      </p>
    </section>
  );
};

export default RecognitionArea;