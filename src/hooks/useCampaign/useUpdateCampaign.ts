// // hooks/useCampaign/useUpdateCampaign.ts
// import { useState } from "react";
// import { UpdateCampaignParams } from "../../types";
// import { findCampaignPDA } from "../../utils/pdas";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { validateCampaignDuration } from "../../utils/validation";
// import { useProgram } from "../useProgram";
// import { SystemProgram } from "@solana/web3.js";

// export const useUpdateCampaign = (campaignTitle: string) => {
//   const { program } = useProgram();
//   const { publicKey: authority } = useWallet();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   const updateCampaign = async (params: UpdateCampaignParams) => {
//     if (!program || !authority) {
//       throw new Error("Program or wallet not connected");
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // Validate updates if needed
//       if (params.endDate) {
//         const campaign = await program.account.campaign.fetch(campaignPDA);
//         if (
//           !validateCampaignDuration(
//             campaign.startDate.toNumber(),
//             params.endDate.toNumber()
//           )
//         ) {
//           throw new Error("Invalid campaign duration");
//         }
//       }

//       const [campaignPDA] = await findCampaignPDA(campaignTitle, authority);

//       const tx = await program.methods
//         .updateCampaign(params)
//         .accounts({
//           authority,
//           campaign: campaignPDA,
//           systemProgram: SystemProgram.programId,
//         })
//         .rpc();

//       return tx;
//     } catch (err) {
//       setError(err as Error);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { updateCampaign, loading, error };
// };

// hooks/useCampaign/useUpdateCampaign.ts
import { useState } from "react";
import { UpdateCampaignParams } from "../../types";
import { findCampaignPDA } from "../../utils/pdas";
import { useWallet } from "@solana/wallet-adapter-react";
import { validateCampaignDuration } from "../../utils/validation";
import { SystemProgram } from "@solana/web3.js";
import { useProgram } from "../useProgram";

export const useUpdateCampaign = (campaignTitle: string) => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCampaign = async (params: UpdateCampaignParams) => {
    if (!program || !authority) {
      throw new Error("Program or wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      const [campaignPDA] = await findCampaignPDA(campaignTitle, authority);

      // Validate updates if needed
      if (params.endDate) {
        const campaign = await program.account.campaign.fetch(campaignPDA);
        if (
          !validateCampaignDuration(
            campaign.startDate.toNumber(),
            params.endDate.toNumber()
          )
        ) {
          throw new Error("Invalid campaign duration");
        }
      }

      // Ensure all optional fields are null rather than undefined
      const formattedParams = {
        description: params.description ?? null,
        imageUrl: params.imageUrl ?? null,
        endDate: params.endDate ?? null,
        status: params.status ?? null,
        isUrgent: params.isUrgent ?? null,
      };

      const tx = await program.methods
        .updateCampaign(formattedParams)
        .accounts({
          authority,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCampaign, loading, error };
};
