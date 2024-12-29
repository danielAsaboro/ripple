// // File: /components/donation/modal/AmountStep.tsx
// import React from "react";
// import Button from "@/components/common/Button";
// import Input from "@/components/common/Input";
// import { MIN_DONATION_AMOUNT } from "@/utils/constants";
// import { lamportsToSol, solToLamports } from "@/utils/format";

// interface AmountStepProps {
//   amount: number;
//   setAmount: (amount: number) => void;
//   frequency: "one-time" | "monthly";
//   setFrequency: (frequency: "one-time" | "monthly") => void;
//   onNext: () => void;
// }

// const PRESET_AMOUNTS = [20, 50, 100, 500, 1000];

// export const AmountStep: React.FC<AmountStepProps> = ({
//   amount,
//   setAmount,
//   frequency,
//   setFrequency,
//   onNext,
// }) => {
//   const handleCustomAmount = (value: string) => {
//     const numValue = parseFloat(value) || 0;
//     setAmount(numValue);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-white mb-2">Choose Amount</h3>
//         <div className="grid grid-cols-3 gap-2">
//           {PRESET_AMOUNTS.map((preset) => (
//             <Button
//               key={preset}
//               variant={amount === preset ? "primary" : "outline"}
//               onClick={() => setAmount(preset)}
//               className="w-full"
//             >
//               ${preset}
//             </Button>
//           ))}
//           <Input
//             type="number"
//             placeholder="Other Amount"
//             value={amount || ""}
//             onChange={(e) => handleCustomAmount(e.target.value)}
//             className="col-span-3"
//           />
//         </div>
//       </div>

//       <div>
//         <h3 className="text-lg font-semibold text-white mb-2">
//           Donation Frequency
//         </h3>
//         <div className="flex gap-2">
//           <Button
//             variant={frequency === "one-time" ? "primary" : "outline"}
//             onClick={() => setFrequency("one-time")}
//             className="flex-1"
//           >
//             One-time
//           </Button>
//           <Button
//             variant={frequency === "monthly" ? "primary" : "outline"}
//             onClick={() => setFrequency("monthly")}
//             className="flex-1"
//           >
//             Monthly
//           </Button>
//         </div>
//       </div>

//       <Button
//         onClick={onNext}
//         disabled={amount < lamportsToSol(MIN_DONATION_AMOUNT)}
//         className="w-full"
//       >
//         Continue
//       </Button>
//     </div>
//   );
// };
// File: /components/donation/modal/AmountStep.tsx
import React from "react";
import Button from "@/components/common/Button";

interface AmountStepProps {
  amountUSD: number;
  setAmountUSD: (amount: number) => void;
  frequency: "one-time" | "monthly";
  setFrequency: (frequency: "one-time" | "monthly") => void;
  onNext: () => void;
  minAmountUSD: number;
  maxAmountUSD: number;
  solPrice: number | null;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100, 500];

export const AmountStep: React.FC<AmountStepProps> = ({
  amountUSD,
  setAmountUSD,
  frequency,
  setFrequency,
  onNext,
  minAmountUSD,
  maxAmountUSD,
  solPrice,
}) => {
  const handleCustomAmount = (value: string) => {
    const amount = parseFloat(value);
    if (!isNaN(amount)) {
      setAmountUSD(amount);
    } else {
      setAmountUSD(0);
    }
  };

  const getSolAmount = (usdAmount: number) => {
    if (!solPrice) return null;
    return Number((usdAmount / solPrice).toFixed(4));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Select Amount</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {PRESET_AMOUNTS.map((preset) => (
            <Button
              key={preset}
              variant={amountUSD === preset ? "primary" : "outline"}
              onClick={() => setAmountUSD(preset)}
              className="w-full"
            >
              ${preset}
            </Button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            $
          </span>
          <input
            type="number"
            value={amountUSD || ""}
            onChange={(e) => handleCustomAmount(e.target.value)}
            placeholder="Custom amount"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-8 pr-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        {solPrice && amountUSD > 0 && (
          <p className="text-sm text-slate-400 mt-2">
            ≈ ◎{getSolAmount(amountUSD)} SOL
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Donation Frequency
        </h3>
        <div className="flex gap-4">
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
        disabled={
          amountUSD < minAmountUSD || amountUSD > maxAmountUSD || !solPrice
        }
        className="w-full"
      >
        {!solPrice
          ? "Loading SOL price..."
          : amountUSD < minAmountUSD
          ? `Minimum donation is $${minAmountUSD}`
          : amountUSD > maxAmountUSD
          ? `Maximum donation is $${maxAmountUSD}`
          : "Continue"}
      </Button>
    </div>
  );
};
