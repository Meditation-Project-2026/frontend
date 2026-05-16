interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
}) => {
  return (
    <div className="mb-4 flex items-center gap-2 justify-center">
      <div
        className={`w-3 h-3 rounded-full ${
          isConnected
            ? 'bg-green-500 animate-pulse'
            : 'bg-red-500'
        }`}
      />

      <span className="text-sm text-[#45947D] font-medium">
        {isConnected
          ? 'WebSocket 연결됨'
          : 'WebSocket 연결 중...'}
      </span>
    </div>
  );
};

export default ConnectionStatus;