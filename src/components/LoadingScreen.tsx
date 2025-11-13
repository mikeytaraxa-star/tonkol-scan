import loadingLogo from "@/assets/loading-logo.png";

interface LoadingScreenProps {
  isExiting: boolean;
}

export const LoadingScreen = ({ isExiting }: LoadingScreenProps) => {
  return (
    <div 
      className={`fixed inset-0 bg-primary flex items-center justify-center z-50 transition-opacity duration-700 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img 
        src={loadingLogo} 
        alt="TON KOL" 
        className="w-32 h-32 animate-pulse"
      />
    </div>
  );
};
