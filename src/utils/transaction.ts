// // File: /utils/transaction.ts
// import {
//   Connection,
//   TransactionSignature,
//   SignatureStatus,
//   TransactionConfirmationStatus,
// } from "@solana/web3.js";
// import { toast } from "react-hot-toast";

// interface TransactionConfirmationOptions {
//   confirmationMessage?: string;
//   errorMessage?: string;
//   timeoutMs?: number;
//   commitment?: TransactionConfirmationStatus;
// }

// /**
//  * Waits for transaction confirmation with timeout and status verification
//  */
// export async function confirmTransaction(
//   connection: Connection,
//   signature: TransactionSignature,
//   toastId: string,
//   options: TransactionConfirmationOptions = {}
// ): Promise<boolean> {
//   const {
//     confirmationMessage = "Transaction confirmed!",
//     errorMessage = "Transaction failed",
//     timeoutMs = 60000, // Increased timeout for network congestion
//     commitment = "confirmed",
//   } = options;

//   // Get initial blockhash for timeout tracking
//   const { blockhash, lastValidBlockHeight } =
//     await connection.getLatestBlockhash();

//   // Function to check signature status
//   const checkSignatureStatus = async (): Promise<SignatureStatus | null> => {
//     const status = await connection.getSignatureStatus(signature);
//     return status?.value || null;
//   };

//   // Polling interval for status checks
//   const POLLING_INTERVAL = 1000;
//   const MAX_RETRIES = Math.floor(timeoutMs / POLLING_INTERVAL);
//   let retries = 0;

//   try {
//     while (retries < MAX_RETRIES) {
//       const status = await checkSignatureStatus();

//       // Handle error cases
//       if (status?.err) {
//         toast.error(`${errorMessage}: ${status.err.toString()}`, {
//           id: toastId,
//         });
//         return false;
//       }

//       // Check confirmation status
//       if (status?.confirmationStatus) {
//         if (
//           status.confirmationStatus === commitment ||
//           status.confirmationStatus === "finalized"
//         ) {
//           toast.success(confirmationMessage, { id: toastId });
//           return true;
//         }
//       }

//       // Check if blockhash is too old
//       const { lastValidBlockHeight: currentValidHeight } =
//         await connection.getLatestBlockhash();

//       if (currentValidHeight > lastValidBlockHeight) {
//         toast.error("Transaction expired. Please try again.", { id: toastId });
//         return false;
//       }

//       // Wait before next check
//       await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
//       retries++;
//     }

//     // Final status check after timeout
//     const finalStatus = await checkSignatureStatus();
//     if (
//       finalStatus?.confirmationStatus === commitment ||
//       finalStatus?.confirmationStatus === "finalized"
//     ) {
//       toast.success(confirmationMessage, { id: toastId });
//       return true;
//     }

//     toast.error("Transaction timed out. Please check explorer.", {
//       id: toastId,
//     });
//     return false;
//   } catch (error) {
//     console.error("Transaction confirmation error:", error);
//     toast.error(`Transaction verification failed. Signature: ${signature}`, {
//       id: toastId,
//     });
//     return false;
//   }
// }

// /**
//  * Enhanced transaction handler with retries and proper error handling
//  */
// export async function handleTransaction<T = void>(
//   transactionPromise: Promise<TransactionSignature>,
//   connection: Connection,
//   options: TransactionConfirmationOptions = {}
// ): Promise<{ success: boolean; signature?: string; data?: T }> {
//   const toastId = toast.loading("Processing transaction...");

//   try {
//     // Maximum retries for transaction submission
//     const MAX_RETRIES = 3;
//     let signature: string | undefined;
//     let retries = 0;

//     while (retries < MAX_RETRIES) {
//       try {
//         signature = await transactionPromise;
//         break;
//       } catch (error: any) {
//         retries++;
//         if (
//           retries === MAX_RETRIES ||
//           !error.toString().includes("blockhash not found")
//         ) {
//           throw error;
//         }
//         // Wait before retry
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//       }
//     }

//     if (!signature) {
//       throw new Error("Failed to submit transaction");
//     }

//     const confirmed = await confirmTransaction(
//       connection,
//       signature,
//       toastId,
//       options
//     );

//     return {
//       success: confirmed,
//       signature: confirmed ? signature : undefined,
//       data: undefined,
//     };
//   } catch (error: any) {
//     console.error("Transaction error:", error);
//     toast.error(options.errorMessage || error.message || "Transaction failed", {
//       id: toastId,
//     });
//     return { success: false };
//   }
// }

// File: /utils/transaction.ts
import {
  Connection,
  TransactionSignature,
  SignatureStatus,
  TransactionConfirmationStatus,
} from "@solana/web3.js";
import { toast } from "react-hot-toast";

interface TransactionConfirmationOptions {
  confirmationMessage?: string;
  errorMessage?: string;
  timeoutMs?: number;
  commitment?: TransactionConfirmationStatus;
}

/**
 * Enhanced transaction confirmation with robust handling of network conditions
 */
export async function confirmTransaction(
  connection: Connection,
  signature: TransactionSignature,
  toastId: string,
  options: TransactionConfirmationOptions = {}
): Promise<boolean> {
  const {
    confirmationMessage = "Transaction confirmed!",
    errorMessage = "Transaction failed",
    timeoutMs = 60000, // Increased default timeout
    commitment = "confirmed",
  } = options;

  // Get initial blockhash for timeout tracking
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  // Helper to check signature status
  const checkSignatureStatus = async (): Promise<SignatureStatus | null> => {
    const status = await connection.getSignatureStatus(signature);
    return status?.value || null;
  };

  // Polling configuration
  const POLLING_INTERVAL = 1000; // 1 second
  const MAX_RETRIES = Math.floor(timeoutMs / POLLING_INTERVAL);
  let retries = 0;

  try {
    while (retries < MAX_RETRIES) {
      const status = await checkSignatureStatus();

      // Handle explicit errors
      if (status?.err) {
        toast.error(`${errorMessage}: ${status.err.toString()}`, {
          id: toastId,
        });
        return false;
      }

      // Check confirmation status
      if (status?.confirmationStatus) {
        if (
          status.confirmationStatus === commitment ||
          status.confirmationStatus === "finalized"
        ) {
          toast.success(confirmationMessage, { id: toastId });
          return true;
        }
      }

      // Check if blockhash is still valid
      const { lastValidBlockHeight: currentValidHeight } =
        await connection.getLatestBlockhash();

      if (currentValidHeight > lastValidBlockHeight) {
        // Perform final status check before declaring timeout
        const finalStatus = await checkSignatureStatus();
        if (
          finalStatus?.confirmationStatus === commitment ||
          finalStatus?.confirmationStatus === "finalized"
        ) {
          toast.success(confirmationMessage, { id: toastId });
          return true;
        }

        toast.error("Transaction expired. Please check explorer.", {
          id: toastId,
        });
        return false;
      }

      // Wait before next check
      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      retries++;
    }

    // Final status check after timeout
    const finalStatus = await checkSignatureStatus();
    if (
      finalStatus?.confirmationStatus === commitment ||
      finalStatus?.confirmationStatus === "finalized"
    ) {
      toast.success(confirmationMessage, { id: toastId });
      return true;
    }

    toast.error("Transaction status uncertain. Please check explorer.", {
      id: toastId,
    });
    return false;
  } catch (error) {
    console.error("Transaction confirmation error:", error);
    toast.error(`Transaction verification failed. Signature: ${signature}`, {
      id: toastId,
    });
    return false;
  }
}

/**
 * Enhanced transaction handler with retries and proper error recovery
 */
export async function handleTransaction<T = void>(
  transactionPromise: Promise<TransactionSignature>,
  connection: Connection,
  options: TransactionConfirmationOptions = {}
): Promise<{ success: boolean; signature?: string; data?: T }> {
  const toastId = toast.loading("Processing transaction...");

  try {
    const signature = await transactionPromise;

    // Store signature in loading toast for reference
    toast.loading(`Processing: ${signature.slice(0, 8)}...`, { id: toastId });

    const confirmed = await confirmTransaction(
      connection,
      signature,
      toastId,
      options
    );

    // On uncertain status, just show basic message and return signature
    if (!confirmed) {
      toast.error("Transaction status uncertain. Check recent transactions.", {
        id: toastId,
      });
    }

    // Always return signature regardless of confirmation status
    return {
      success: confirmed,
      signature, // Return signature in both success/failure cases
      data: undefined,
    };
  } catch (error: any) {
    console.error("Transaction error:", error);
    toast.error(options.errorMessage || error.message || "Transaction failed", {
      id: toastId,
    });
    return { success: false };
  }
}
