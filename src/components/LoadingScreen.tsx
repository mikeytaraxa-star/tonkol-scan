import loadingAnimation from "@/assets/loading-animation.mp4";

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
      <video 
        src={loadingAnimation} 
        autoPlay
        loop
        muted
        playsInline
        className="w-64 h-64 object-contain"
      />
    </div>
  );
};
