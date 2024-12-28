// src/components/auth/DynamicAuthButton.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@/contexts/UserProvider";
import { useProgram } from "@/hooks/useProgram";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { toast } from "react-hot-toast";
import { findUserPDA } from "@/utils/pdas";
import { UsernameSelectionModal } from "./UsernameSelectionModal";

interface AuthState {
  walletConnected: boolean;
  programReady: boolean;
  accountExists: boolean;
  loading: boolean;
  error: string | null;
}

export const DynamicAuthButton = () => {
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const { initializeUser } = useUser();
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    walletConnected: false,
    programReady: false,
    accountExists: false,
    loading: true,
    error: null,
  });

  const [showUsernameModal, setShowUsernameModal] = useState(false);

  // Check wallet connection and program initialization
  useEffect(() => {
    const checkConnection = async () => {
      setAuthState((prev) => ({ ...prev, loading: true }));

      try {
        if (!connected || !publicKey) {
          setAuthState({
            walletConnected: false,
            programReady: false,
            accountExists: false,
            loading: false,
            error: null,
          });
          return;
        }

        if (!program) {
          setAuthState((prev) => ({
            ...prev,
            walletConnected: true,
            programReady: false,
            error: "Program not initialized",
          }));
          return;
        }

        // Add a small delay to ensure proper initialization
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if user account exists
        const [userPDA] = await findUserPDA(publicKey);
        try {
          await program.account.user.fetch(userPDA);
          setAuthState({
            walletConnected: true,
            programReady: true,
            accountExists: true,
            loading: false,
            error: null,
          });
        } catch (err) {
          if (
            err instanceof Error &&
            err.message.includes("Account does not exist")
          ) {
            setAuthState({
              walletConnected: true,
              programReady: true,
              accountExists: false,
              loading: false,
              error: null,
            });
          } else {
            throw err;
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to check authentication status",
        }));
      }
    };

    checkConnection();
  }, [connected, publicKey, program]);

  const handleCreateAccount = async (username: string) => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      if (!program || !publicKey) {
        throw new Error("Please ensure your wallet is connected");
      }

      await initializeUser(username);
      toast.success("Account created successfully!");
      setShowUsernameModal(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating account:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again";
      toast.error(errorMessage);
      setAuthState((prev) => ({
        ...prev,
        error: "Account creation failed",
      }));
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  // UI States
  if (authState.loading) {
    return (
      <Button disabled>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
        Loading...
      </Button>
    );
  }

  if (!authState.walletConnected) {
    return (
      <WalletMultiButton className="bg-green-600 hover:bg-green-700 text-white rounded-lg" />
    );
  }

  if (!authState.programReady) {
    return (
      <Button disabled className="bg-yellow-600">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
        Connecting to Program...
      </Button>
    );
  }

  if (authState.error) {
    return (
      <Button
        onClick={() => setAuthState((prev) => ({ ...prev, error: null }))}
        className="bg-red-600 hover:bg-red-700"
      >
        {authState.error} - Retry
      </Button>
    );
  }

  if (!authState.accountExists) {
    return (
      <>
        <Button
          onClick={() => setShowUsernameModal(true)}
          className="bg-green-600 hover:bg-green-700"
          disabled={authState.loading}
        >
          Create Account
        </Button>

        <UsernameSelectionModal
          isOpen={showUsernameModal}
          onClose={() => setShowUsernameModal(false)}
          onSubmit={handleCreateAccount}
          loading={authState.loading}
        />
      </>
    );
  }

  return (
    <Button
      onClick={() => router.push("/dashboard")}
      className="bg-green-600 hover:bg-green-700"
    >
      Dashboard
    </Button>
  );
};

//// src/components/auth/DynamicAuthButton.tsx
// "use client";
// import React, { useState, useEffect } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { useUser } from "@/contexts/UserProvider";
// import { useProgram } from "@/hooks/useProgram";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import { useRouter } from "next/navigation";
// import { SendTransactionError } from "@solana/web3.js";
// import Button from "@/components/common/Button";
// import { toast } from "react-hot-toast";
// import { findUserPDA } from "@/utils/pdas";
// import { UsernameSelectionModal } from "./UsernameSelectionModal";
// import { PROGRAM_ID } from "@/utils/constants";

// interface AuthState {
//   walletConnected: boolean;
//   programReady: boolean;
//   accountExists: boolean;
//   loading: boolean;
//   error: string | null;
// }

// export const DynamicAuthButton = () => {
//   const { connected, publicKey } = useWallet();
//   const { program } = useProgram();
//   const { initializeUser } = useUser();
//   const router = useRouter();

//   const [authState, setAuthState] = useState<AuthState>({
//     walletConnected: false,
//     programReady: false,
//     accountExists: false,
//     loading: true,
//     error: null,
//   });

//   const [showUsernameModal, setShowUsernameModal] = useState(false);

//   useEffect(() => {
//     const checkConnection = async () => {
//       setAuthState((prev) => ({ ...prev, loading: true }));

//       try {
//         if (!connected || !publicKey) {
//           setAuthState({
//             walletConnected: false,
//             programReady: false,
//             accountExists: false,
//             loading: false,
//             error: null,
//           });
//           return;
//         }

//         if (!program) {
//           setAuthState((prev) => ({
//             ...prev,
//             walletConnected: true,
//             programReady: false,
//             error: "Program not initialized",
//           }));
//           return;
//         }

//         console.log("program id of ripple:", PROGRAM_ID.toBase58())
//         console.log("cluster we are connected to", )
//         // Verify program exists
//         try {
//           const programInfo = await program.provider.connection.getAccountInfo(
//             PROGRAM_ID
//           );
//           if (!programInfo) {
//             setAuthState((prev) => ({
//               ...prev,
//               programReady: false,
//               loading: false,
//               error: "Program not deployed to this network",
//             }));
//             return;
//           }
//         } catch (err) {
//           console.error("Error checking program:", err);
//           setAuthState((prev) => ({
//             ...prev,
//             programReady: false,
//             loading: false,
//             error: "Failed to verify program deployment",
//           }));
//           return;
//         }

//         // Add a small delay to ensure proper initialization
//         await new Promise((resolve) => setTimeout(resolve, 500));

//         // Check if user account exists
//         const [userPDA] = await findUserPDA(publicKey);
//         try {
//           await program.account.user.fetch(userPDA);
//           setAuthState({
//             walletConnected: true,
//             programReady: true,
//             accountExists: true,
//             loading: false,
//             error: null,
//           });
//         } catch (err) {
//           if (
//             err instanceof Error &&
//             err.message.includes("Account does not exist")
//           ) {
//             setAuthState({
//               walletConnected: true,
//               programReady: true,
//               accountExists: false,
//               loading: false,
//               error: null,
//             });
//           } else {
//             throw err;
//           }
//         }
//       } catch (error) {
//         console.error("Auth check error:", error);
//         setAuthState((prev) => ({
//           ...prev,
//           loading: false,
//           error: "Failed to check authentication status",
//         }));
//       }
//     };

//     checkConnection();
//   }, [connected, publicKey, program]);

//   const handleCreateAccount = async (username: string) => {
//     if (!username.trim()) {
//       toast.error("Please enter a username");
//       return;
//     }

//     setAuthState((prev) => ({ ...prev, loading: true }));

//     try {
//       if (!program || !publicKey) {
//         throw new Error("Please ensure your wallet is connected");
//       }

//       // Verify program exists before attempting initialization
//       const programInfo = await program.provider.connection.getAccountInfo(
//         PROGRAM_ID
//       );
//       if (!programInfo) {
//         throw new Error(
//           "Program not deployed to this network. Please switch to the correct network."
//         );
//       }

//       await initializeUser(username);
//       toast.success("Account created successfully!");
//       setShowUsernameModal(false);
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Error creating account:", error);

//       let errorMessage = "Failed to create account. Please try again";

//       if (error instanceof SendTransactionError) {
//         if (error.message.includes("Transaction simulation failed")) {
//           errorMessage =
//             "Program not properly initialized. Please verify you're on the correct network.";
//         } else {
//           errorMessage = "Transaction failed. Please try again.";
//         }
//       } else if (error instanceof Error) {
//         errorMessage = error.message;
//       }

//       toast.error(errorMessage);
//       setAuthState((prev) => ({
//         ...prev,
//         error: errorMessage,
//       }));
//     } finally {
//       setAuthState((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   const retryConnection = async () => {
//     setAuthState((prev) => ({ ...prev, error: null, loading: true }));
//     try {
//       if (program) {
//         const programInfo = await program.provider.connection.getAccountInfo(
//           PROGRAM_ID
//         );
//         if (!programInfo) {
//           throw new Error(
//             "Program not found. Please switch to the correct network."
//           );
//         }
//       }
//       // Reinitialize connection check
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       window.location.reload(); // Reload to reinitialize program connection
//     } catch (error) {
//       toast.error(
//         "Failed to reconnect. Please verify you're on the correct network."
//       );
//     }
//   };

//   // UI States
//   if (authState.loading) {
//     return (
//       <Button disabled>
//         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
//         Loading...
//       </Button>
//     );
//   }

//   if (!authState.walletConnected) {
//     return (
//       <WalletMultiButton className="bg-green-600 hover:bg-green-700 text-white rounded-lg" />
//     );
//   }

//   if (!authState.programReady) {
//     return (
//       <Button
//         onClick={retryConnection}
//         className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
//       >
//         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
//         Reconnect to Program
//       </Button>
//     );
//   }

//   if (authState.error) {
//     return (
//       <Button onClick={retryConnection} className="bg-red-600 hover:bg-red-700">
//         {authState.error} - Retry
//       </Button>
//     );
//   }

//   if (!authState.accountExists) {
//     return (
//       <>
//         <Button
//           onClick={() => setShowUsernameModal(true)}
//           className="bg-green-600 hover:bg-green-700"
//           disabled={authState.loading}
//         >
//           Create Account
//         </Button>

//         <UsernameSelectionModal
//           isOpen={showUsernameModal}
//           onClose={() => setShowUsernameModal(false)}
//           onSubmit={handleCreateAccount}
//           loading={authState.loading}
//         />
//       </>
//     );
//   }

//   return (
//     <Button
//       onClick={() => router.push("/dashboard")}
//       className="bg-green-600 hover:bg-green-700"
//     >
//       Dashboard
//     </Button>
//   );
// };
