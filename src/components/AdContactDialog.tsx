import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Megaphone, ExternalLink } from "lucide-react";

interface AdContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdContactDialog = ({ open, onOpenChange }: AdContactDialogProps) => {
  const benefits = [
    "Reach 12K+ weekly visitors",
    "Prime banner placement",
    "Custom CTA button",
    "Targeted TON ecosystem audience",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Advertise on Tonkol
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Promote your project to 12,000+ visitors
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Pricing */}
          <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-3xl font-bold text-primary">30 TON</p>
            <p className="text-sm text-muted-foreground">for 7 days</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">What you get:</p>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Ad Mockup */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Ad Preview:</p>
            <div className="w-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border border-primary/30 py-2.5 px-3 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <Megaphone className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs text-foreground/90">
                  <span className="font-semibold text-primary">Your Project</span>
                  <span className="mx-1.5 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Your ad message here...</span>
                </p>
                <span className="text-[10px] font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Your CTA
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <a
              href="https://t.me/yugoslavac"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Contact Founder
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
