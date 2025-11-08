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
      <div className="text-center">
        <img 
          src={loadingLogo} 
          alt="TON KOL" 
          className="w-32 h-32 mx-auto mb-8 animate-pulse"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-white animate-pulse">
          Know where and who on Ton
        </h1>
      </div>
    </div>
  );
};
