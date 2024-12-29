// File: /components/donation/DonationAlert.tsx
import React, { useEffect, useState } from "react";
import { WebhookEvent } from "@/types/events";
import { lamportsToSol } from "@/utils/format";
import { AnimatePresence, motion } from "framer-motion";

interface DonationAlertProps {
  event: WebhookEvent;
  onClose: () => void;
}

export const DonationAlert = ({ event, onClose }: DonationAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-slate-800 rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-400/10 flex items-center justify-center">
              <span className="text-green-400 text-lg">◎</span>
            </div>
            <div>
              <p className="text-white font-medium">
                New Donation: {lamportsToSol(event.payload.data.amount)} SOL
              </p>
              <p className="text-sm text-slate-400">
                Thank you for supporting our cause!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
