// File: /components/donation/modal/AmountStep.tsx
import React from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { MIN_DONATION_AMOUNT } from "@/utils/constants";
import { lamportsToSol, solToLamports } from "@/utils/format";

interface AmountStepProps {
  amount: number;
  setAmount: (amount: number) => void;
  frequency: "one-time" | "monthly";
  setFrequency: (frequency: "one-time" | "monthly") => void;
  onNext: () => void;
}

const PRESET_AMOUNTS = [20, 50, 100, 500, 1000];

export const AmountStep: React.FC<AmountStepProps> = ({
  amount,
  setAmount,
  frequency,
  setFrequency,
  onNext,
}) => {
  const handleCustomAmount = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setAmount(numValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Choose Amount</h3>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <Button
              key={preset}
              variant={amount === preset ? "primary" : "outline"}
              onClick={() => setAmount(preset)}
              className="w-full"
            >
              ${preset}
            </Button>
          ))}
          <Input
            type="number"
            placeholder="Other Amount"
            value={amount || ""}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Donation Frequency
        </h3>
        <div className="flex gap-2">
          <Button
            variant={frequency === "one-time" ? "primary" : "outline"}
            onClick={() => setFrequency("one-time")}
            className="flex-1"
          >
            One-time
          </Button>
          <Button
            variant={frequency === "monthly" ? "primary" : "outline"}
            onClick={() => setFrequency("monthly")}
            className="flex-1"
          >
            Monthly
          </Button>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={amount < lamportsToSol(MIN_DONATION_AMOUNT)}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
};
