import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Crypto KOL Tracker" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crypto KOL Tracker</h1>
            <p className="text-sm text-muted-foreground">Real-Time Trade Monitoring</p>
          </div>
        </div>
      </div>
    </header>
  );
};
