// File: /components/donation/modal/PaymentStep.tsx
import React, { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Campaign } from "@/types";
import { useDonate } from "@/hooks/useDonation";
import { BN } from "@coral-xyz/anchor";
import { solToLamports } from "@/utils/format";
import { toast } from "react-hot-toast";

interface PaymentStepProps {
  amount: number;
  frequency: "one-time" | "monthly";
  campaign: Campaign;
  onBack: () => void;
  onSuccess: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  amount,
  frequency,
  campaign,
  onBack,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "card">(
    "crypto"
  );
  const [addToDonorWall, setAddToDonorWall] = useState(false);
  const { donate, loading } = useDonate();

  const handleSubmit = async () => {
    try {
      await donate({
        campaignPDA: campaign.authority,
        amount: new BN(solToLamports(amount)),
        paymentMethod: { cryptoWallet: {} },
      });
      toast.success("Donation successful!");
      onSuccess();
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to process donation");
    }
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

        {paymentMethod === "card" && (
          <div className="space-y-4">
            <Input type="text" placeholder="Name" label="Name on Card" />
            <Input type="email" placeholder="Email" label="Email Address" />
            <Input type="text" placeholder="Card Number" label="Card Number" />
            <div className="grid grid-cols-2 gap-4">
              <Input type="text" placeholder="MM/YYYY" label="Expiry Date" />
              <Input type="text" placeholder="CVV" label="Security Code" />
            </div>
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

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="flex-1"
        >
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="flex-1">
          {loading ? "Processing..." : `Donate $${amount}`}
        </Button>
      </div>
    </div>
  );
};
