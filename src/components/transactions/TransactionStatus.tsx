// // File: /components/transactions/TransactionStatus.tsx
// import { useTransactions } from '@/hooks/useTransactions'; // You'd need to create this

// export const TransactionStatus = () => {
//   const { recentTransactions } = useTransactions();

//   return (
//     <div className="space-y-2">
//       {recentTransactions.map(tx => (
//         <div key={tx.signature} className="flex justify-between items-center">
//           <span>{tx.status}</span>
//           <a
//             href={`https://explorer.solana.com/tx/${tx.signature}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-400 hover:text-blue-300"
//           >
//             View on Explorer
//           </a>
//         </div>
//       ))}
//     </div>
//   );
// };
