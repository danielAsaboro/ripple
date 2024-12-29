// // File: /components/donation/modal/PaymentStep.tsx
// import React, { useState } from "react";
// import Button from "@/components/common/Button";
// import Input from "@/components/common/Input";
// import { CampaignWithKey } from "@/types";
// import { useDonate } from "@/hooks/useDonation";
// import { BN } from "@coral-xyz/anchor";
// import { solToLamports } from "@/utils/format";
// import { toast } from "react-hot-toast";
// import { useWallet } from "@solana/wallet-adapter-react";

// interface PaymentStepProps {
//   amount: number;
//   frequency: "one-time" | "monthly";
//   campaign: CampaignWithKey;
//   onBack: () => void;
//   onSuccess: () => void;
// }

// export const PaymentStep: React.FC<PaymentStepProps> = ({
//   amount,
//   frequency,
//   campaign,
//   onBack,
//   onSuccess,
// }) => {
//   const { publicKey } = useWallet();
//   const [paymentMethod, setPaymentMethod] = useState<"crypto" | "card">(
//     "crypto"
//   );
//   const [addToDonorWall, setAddToDonorWall] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const { donate, loading } = useDonate();

//   const handleSubmit = async () => {
//     if (!publicKey) {
//       toast.error("Please connect your wallet first");
//       return;
//     }

//     try {
//       await donate({
//         campaignPDA: campaign.publicKey,
//         amount: new BN(solToLamports(amount)),
//         paymentMethod: { cryptoWallet: {} },
//       });

//       toast.success("Thank you for your donation!");
//       onSuccess();
//     } catch (error: any) {
//       console.error("Donation error:", error);
//       toast.error(error?.message || "Failed to process donation");
//     }
//   };

//   const handleCardPayment = async () => {
//     // Placeholder for future card payment implementation
//     toast.error("Card payments are not yet supported");
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-white mb-4">
//           Payment Method
//         </h3>
//         <div className="flex gap-4 mb-6">
//           <Button
//             variant={paymentMethod === "crypto" ? "primary" : "outline"}
//             onClick={() => setPaymentMethod("crypto")}
//             className="flex-1"
//           >
//             Cryptocurrency
//           </Button>
//           <Button
//             variant={paymentMethod === "card" ? "primary" : "outline"}
//             onClick={() => setPaymentMethod("card")}
//             className="flex-1"
//           >
//             Debit Card
//           </Button>
//         </div>

//         {paymentMethod === "card" ? (
//           <div className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Name"
//               label="Name on Card"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//             <Input
//               type="email"
//               placeholder="Email"
//               label="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <Input
//               type="text"
//               placeholder="Card Number"
//               label="Card Number"
//               required
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 type="text"
//                 placeholder="MM/YYYY"
//                 label="Expiry Date"
//                 required
//               />
//               <Input
//                 type="text"
//                 placeholder="CVV"
//                 label="Security Code"
//                 required
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Name (Optional)"
//               label="Your Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <Input
//               type="email"
//               placeholder="Email (Optional)"
//               label="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               helperText="We'll send you updates about this campaign"
//             />
//           </div>
//         )}

//         <div className="mt-4">
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={addToDonorWall}
//               onChange={(e) => setAddToDonorWall(e.target.checked)}
//               className="form-checkbox h-4 w-4 text-green-400"
//             />
//             <span className="text-sm text-slate-400">
//               Add me to the donor wall
//             </span>
//           </label>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <div className="border border-slate-700 rounded-lg p-4">
//           <div className="flex justify-between text-sm mb-2">
//             <span className="text-slate-400">Donation Amount</span>
//             <span className="text-white">◎ {amount}</span>
//           </div>
//           {frequency === "monthly" && (
//             <p className="text-xs text-slate-500">
//               Your donation will be processed monthly
//             </p>
//           )}
//         </div>

//         <div className="flex gap-4">
//           <Button
//             variant="outline"
//             onClick={onBack}
//             disabled={loading}
//             className="flex-1"
//           >
//             Back
//           </Button>
//           <Button
//             onClick={
//               paymentMethod === "crypto" ? handleSubmit : handleCardPayment
//             }
//             disabled={loading}
//             className="flex-1"
//           >
//             {loading ? "Processing..." : `Donate ◎${amount}`}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { CampaignWithKey } from "@/types";
import { useDonate } from "@/hooks/useDonation";
import { BN } from "@coral-xyz/anchor";
import { solToLamports } from "@/utils/format";
import { toast } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

interface PaymentStepProps {
  amountUSD: number;
  amountSOL: number;
  frequency: "one-time" | "monthly";
  campaign: CampaignWithKey;
  onBack: () => void;
  onSuccess: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  amountUSD,
  amountSOL,
  frequency,
  campaign,
  onBack,
  onSuccess,
}) => {
  const { publicKey } = useWallet();
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "card">(
    "crypto"
  );
  const [addToDonorWall, setAddToDonorWall] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { donate, loading } = useDonate();

  const handleSubmit = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await donate({
        campaignPDA: campaign.publicKey,
        amount: new BN(solToLamports(amountSOL)),
        paymentMethod: { cryptoWallet: {} },
      });

      toast.success("Thank you for your donation!");
      onSuccess();
    } catch (error: any) {
      console.error("Donation error:", error);
      toast.error(error?.message || "Failed to process donation");
    }
  };

  const handleCardPayment = async () => {
    // Placeholder for future card payment implementation
    toast.error("Card payments are not yet supported");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Payment Method
        </h3>
        <div className="flex gap-4 mb-6">
          <Button
            variant={paymentMethod === "crypto" ? "primary" : "outline"}
            onClick={() => setPaymentMethod("crypto")}
            className="flex-1"
          >
            Cryptocurrency
          </Button>
          <Button
            variant={paymentMethod === "card" ? "primary" : "outline"}
            onClick={() => setPaymentMethod("card")}
            className="flex-1"
          >
            Debit Card
          </Button>
        </div>

        {paymentMethod === "card" ? (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              label="Name on Card"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Card Number"
              label="Card Number"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="MM/YYYY"
                label="Expiry Date"
                required
              />
              <Input
                type="text"
                placeholder="CVV"
                label="Security Code"
                required
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Name (Optional)"
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email (Optional)"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="We'll send you updates about this campaign"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={addToDonorWall}
              onChange={(e) => setAddToDonorWall(e.target.checked)}
              className="form-checkbox h-4 w-4 text-green-400"
            />
            <span className="text-sm text-slate-400">
              Add me to the donor wall
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-slate-700 rounded-lg p-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Donation Amount (USD)</span>
              <span className="text-white">${amountUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Amount in SOL</span>
              <span className="text-white">◎ {amountSOL.toFixed(4)}</span>
            </div>
          </div>
          {frequency === "monthly" && (
            <p className="text-xs text-slate-500 mt-2">
              Your donation will be processed monthly
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={loading}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={
              paymentMethod === "crypto" ? handleSubmit : handleCardPayment
            }
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Processing..." : `Donate ◎${amountSOL.toFixed(4)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
