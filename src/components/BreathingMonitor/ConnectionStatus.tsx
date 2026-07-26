interface ConnectionStatusProps {
  isConnected: boolean;
  inverted?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, inverted = false }) => {
  return (
    <div className="mb-4 flex justify-center">
      <div
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
          isConnected ? 'bg-green-500/10' : 'bg-red-500/10'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span
          className={`text-xs font-medium ${
            inverted
              ? isConnected
                ? 'text-green-400'
                : 'text-red-400'
              : isConnected
                ? 'text-green-700 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
          }`}
        >
          {isConnected ? 'WebSocket 연결됨' : 'WebSocket 연결 중'}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;