import DataCard from "../components/BreathingMonitor/DataCard";
import Header from "../components/Header";
import RecognitionArea from "../components/BreathingMonitor/RecognitionArea";

const BreathingMonitor: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-zinc-950 flex flex-col">
      <Header title="호흡 모니터링" onBack={() => window.history.back()} />

      <main className="flex-1 flex flex-col justify-center px-6 pb-10 max-w-2xl mx-auto w-full">
        <RecognitionArea />

        <section className="grid grid-cols-2 gap-4">
          <DataCard label="심박수" value={72} unit="bpm" />
          <DataCard label="LF/HF" value={65} unit="ratio" />
        </section>
      </main>
    </div>
  );
};

export default BreathingMonitor;