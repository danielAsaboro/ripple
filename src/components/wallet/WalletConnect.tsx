// // File: /components/wallet/WalletConnect.tsx
// import React from "react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { X } from "lucide-react";
// import Card from "@/components/common/Card";
// import Button from "@/components/common/Button";
// import { validateEmail } from "@/utils/validation";
// import Input from "@/components/common/Input";

// interface WalletConnectProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const WalletConnect: React.FC<WalletConnectProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const { connected } = useWallet();
//   const [email, setEmail] = React.useState("");
//   const [isEmailValid, setIsEmailValid] = React.useState(true);

//   const handleEmailSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateEmail(email)) {
//       // Handle email wallet creation
//       setIsEmailValid(true);
//     } else {
//       setIsEmailValid(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <Card className="w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-slate-400 hover:text-white"
//         >
//           <X className="h-5 w-5" />
//         </button>

//         <div className="p-6 space-y-6">
//           <div className="text-center">
//             <h3 className="text-xl font-semibold text-white">WalletConnect</h3>
//             <p className="text-sm text-slate-400 mt-2">
//               Connect your wallet to start donating and tracking your
//               contributions in real time. Your wallet ensures secure and
//               transparent transactions.
//             </p>
//           </div>

//           {/* Email Option */}
//           <form onSubmit={handleEmailSubmit} className="space-y-4">
//             <Input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               error={!isEmailValid ? "Please enter a valid email" : undefined}
//             />
//           </form>

//           <div className="text-center text-sm text-slate-400">Or</div>

//           {/* Wallet Options */}
//           <div className="space-y-3">
//             <WalletOption
//               name="Solflare"
//               icon="/solflare-icon.svg"
//               status="connected"
//             />
//             <WalletOption
//               name="Phantom"
//               icon="/phantom-icon.svg"
//               actionLabel="Get"
//               onClick={() => window.open("https://phantom.app", "_blank")}
//             />
//             <WalletOption
//               name="Backpack"
//               icon="/backpack-icon.svg"
//               actionLabel="Get"
//               onClick={() => window.open("https://backpack.app", "_blank")}
//             />
//           </div>

//           <Button
//             onClick={handleEmailSubmit}
//             className="w-full"
//             variant="primary"
//           >
//             Connect
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// interface WalletOptionProps {
//   name: string;
//   icon: string;
//   status?: "connected" | "detected";
//   actionLabel?: string;
//   onClick?: () => void;
// }

// const WalletOption: React.FC<WalletOptionProps> = ({
//   name,
//   icon,
//   status,
//   actionLabel,
//   onClick,
// }) => {
//   return (
//     <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
//       <div className="flex items-center space-x-3">
//         <img src={icon} alt={name} className="w-6 h-6" />
//         <span className="text-white">{name}</span>
//       </div>
//       {status === "connected" ? (
//         <span className="text-sm text-green-400">Connected</span>
//       ) : status === "detected" ? (
//         <span className="text-sm text-blue-400">Detected</span>
//       ) : actionLabel ? (
//         <button
//           onClick={onClick}
//           className="text-sm text-green-400 hover:text-green-500"
//         >
//           {actionLabel} →
//         </button>
//       ) : null}
//     </div>
//   );
// };

// File: /components/wallet/WalletConnect.tsx
import React from "react";
import { X } from "lucide-react";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { WalletOption } from "./WalletOption";
import { validateEmail } from "@/utils/validation";

interface WalletConnectProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setIsEmailValid(true);
      // Handle email wallet creation
    } else {
      setIsEmailValid(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white">WalletConnect</h3>
            <p className="text-sm text-slate-400 mt-2">
              Connect your wallet to start donating and tracking your
              contributions in real time. Your wallet ensures secure and
              transparent transactions.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              error={!isEmailValid ? "Please enter a valid email" : undefined}
            />
          </form>

          <div className="text-center text-sm text-slate-400">Or</div>

          <div className="space-y-3">
            <WalletOption
              name="Solflare"
              icon="/solflare-icon.svg"
              status="detected"
            />
            <WalletOption
              name="Phantom"
              icon="/phantom-icon.svg"
              actionLabel="Get"
              onClick={() => window.open("https://phantom.app", "_blank")}
            />
            <WalletOption
              name="Backpack"
              icon="/backpack-icon.svg"
              actionLabel="Get"
              onClick={() => window.open("https://backpack.app", "_blank")}
            />
          </div>

          <Button onClick={handleEmailSubmit} className="w-full">
            Connect
          </Button>
        </div>
      </Card>
    </div>
  );
};
