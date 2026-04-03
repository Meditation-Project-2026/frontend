import CameraFrame from "../components/FaceDetection/CameraFrame";
import Header from "../components/Header";
import ProgressCircle from "../components/FaceDetection/ProgressCircle";


const FaceDetection: React.FC = () => {
  const handleBack = () => console.log("Back clicked");
  const handleCancel = () => console.log("Cancel clicked");

  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto">
      <Header title="Face Detection" onBack={handleBack} rightType="text" rightText="Cancel" onRightClick={handleCancel} />
      
      <main className="flex-1 flex flex-col items-center px-6 w-full relative z-10">
        <div className="w-full text-center mt-2 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] dark:text-white leading-tight mb-2">
            명상 전, 카메라를 응시하고<br/>얼굴을 프레임 안에 맞춰주세요.
          </h2>
          <p className="text-sm text-[#6B7280]">
            정확한 측정을 위해 움직임을 최소화해주세요.
          </p>
        </div>

        <CameraFrame />
        <ProgressCircle percentage={75} />
      </main>
    </div>
  );
};

export default FaceDetection;