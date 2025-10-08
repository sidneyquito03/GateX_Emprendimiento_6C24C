import { Card } from "@/components/ui/card";
import { Lock, RefreshCw, CheckCircle2 } from "lucide-react";

interface TransactionStatusProps {
  status: "custody" | "transferring" | "completed";
}

export const TransactionStatus = ({ status }: TransactionStatusProps) => {
  const steps = [
    {
      key: "custody",
      icon: Lock,
      label: "Pago recibido en custodia",
      active: status === "custody" || status === "transferring" || status === "completed",
    },
    {
      key: "transferring",
      icon: RefreshCw,
      label: "Ticket transferido",
      active: status === "transferring" || status === "completed",
    },
    {
      key: "completed",
      icon: CheckCircle2,
      label: "Fondos liberados",
      active: status === "completed",
    },
  ];

  return (
    <Card className="glass-card p-6">
      <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
        Estado de la Transacción
      </h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.active;
          const isCurrent = step.key === status;

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                } ${isCurrent ? "animate-pulse-glow" : ""}`}
              >
                <StepIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-success" />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-xs text-foreground/80 text-center">
          Tu dinero y tu ticket siempre están protegidos por el Smart Contract
        </p>
      </div>
    </Card>
  );
};