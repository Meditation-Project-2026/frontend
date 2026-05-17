import DataCard from './DataCard';

interface BiometricCardsProps {
  heartRate: number;
  lfHfRatio: number;
}

const BiometricCards: React.FC<BiometricCardsProps> = ({
  heartRate,
  lfHfRatio,
}) => {
  return (
    <section className="grid grid-cols-2 gap-4 mb-8">
      <DataCard
        label="심박수"
        value={heartRate || '-'}
        unit="bpm"
      />

      <DataCard
        label="LF/HF"
        value={lfHfRatio || '-'}
        unit="ratio"
      />
    </section>
  );
};

export default BiometricCards;