import React from 'react';

const CameraFrame: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#245d52] p-3 rounded-[2rem] shadow-md w-full aspect-[3.5/4.5] relative flex items-center justify-center mb-8 overflow-hidden">
      <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-gray-100 dark:bg-gray-900 group">
        {/* 실제 카메라 구현 시 <video> 태그가 들어갈 자리입니다 */}
        <img 
          alt="Camera feed placeholder" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-black/5"></div>
        
        {/* Corner Guides */}
        <div className="absolute inset-8 pointer-events-none">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-white/90 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-white/90 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-white/90 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-white/90 rounded-br-2xl"></div>
          
          {/* Scanning Line */}
          <div className="absolute w-full h-[2px] bg-[#45947D] shadow-[0_0_10px_rgba(107,230,193,0.8)] animate-scan left-0"></div>
        </div>
      </div>
    </div>
  );
};

export default CameraFrame;