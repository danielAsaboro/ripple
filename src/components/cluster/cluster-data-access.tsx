// File: /components/cluster/cluster-data-access.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export enum ClusterNetwork {
  Mainnet = "mainnet-beta",
  Devnet = "devnet",
  Testnet = "testnet",
  Localnet = "localnet",
}

export interface Cluster {
  name: string;
  endpoint: string;
  network?: ClusterNetwork;
  active?: boolean;
}

interface ClusterContextState {
  clusters: Cluster[];
  cluster: Cluster;
  setCluster: (cluster: Cluster) => void;
  addCluster: (cluster: Cluster) => void;
  deleteCluster: (cluster: Cluster) => void;
  getExplorerUrl: (path: string) => string;
}

// Default clusters
const defaultClusters: Cluster[] = [
  {
    name: "Localnet",
    endpoint: "http://localhost:8899",
    network: ClusterNetwork.Localnet,
    // active: true,
  },
  {
    name: "Devnet",
    endpoint: clusterApiUrl("devnet"),
    network: ClusterNetwork.Devnet,
    active: true,
  },
  {
    name: "Testnet",
    endpoint: clusterApiUrl("testnet"),
    network: ClusterNetwork.Testnet,
  },
  {
    name: "Mainnet",
    endpoint: clusterApiUrl("mainnet-beta"),
    network: ClusterNetwork.Mainnet,
  },
];

const ClusterContext = createContext<ClusterContextState | undefined>(
  undefined
);

export function ClusterProvider({ children }: { children: React.ReactNode }) {
  const [clusters, setClusters] = useState<Cluster[]>(() => {
    // Always ensure all default clusters are present
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clusters");
      if (saved) {
        const parsedClusters = JSON.parse(saved);
        // Ensure all default clusters exist by merging them
        const mergedClusters = defaultClusters.map((defaultCluster) => {
          const savedCluster = parsedClusters.find(
            (c: Cluster) => c.name === defaultCluster.name
          );
          return savedCluster || defaultCluster;
        });
        // Add any additional custom clusters
        const customClusters = parsedClusters.filter(
          (c: Cluster) => !defaultClusters.some((dc) => dc.name === c.name)
        );
        return [...mergedClusters, ...customClusters];
      }
    }
    return defaultClusters;
  });

  const [cluster, setClusterState] = useState<Cluster>(() => {
    return clusters.find((c) => c.active) || clusters[0];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("clusters", JSON.stringify(clusters));
      // Add logging for initial cluster setup
      const activeCluster = clusters.find((c) => c.active);
      if (activeCluster) {
        console.log("Initial Cluster URL:", activeCluster.endpoint);
        console.log("Initial Cluster Network:", activeCluster.network);
      }
    }
  }, [clusters]);

  const setCluster = (newCluster: Cluster) => {
    setClusters(
      clusters.map((c) => ({
        ...c,
        active: c.name === newCluster.name,
      }))
    );
    setClusterState(newCluster);
    // Add logging here to track cluster changes
    console.log("Current Cluster URL:", newCluster.endpoint);
    console.log("Current Cluster Network:", newCluster.network);
  };

  const addCluster = (newCluster: Cluster) => {
    setClusters([...clusters, { ...newCluster, active: false }]);
  };

  const deleteCluster = (clusterToDelete: Cluster) => {
    // Prevent deletion of default clusters
    if (defaultClusters.some((c) => c.name === clusterToDelete.name)) {
      return;
    }
    setClusters(clusters.filter((c) => c.name !== clusterToDelete.name));
  };

  const getExplorerUrl = (path: string) => {
    // Handle local cluster differently
    if (cluster.network === ClusterNetwork.Localnet) {
      return `http://localhost:3000/${path}`; // Adjust port if needed for local explorer
    }

    const endpoint =
      cluster.network === ClusterNetwork.Mainnet
        ? "mainnet"
        : cluster.network?.toLowerCase() || "custom";
    return `https://explorer.solana.com/${path}?cluster=${endpoint}`;
  };

  return (
    <ClusterContext.Provider
      value={{
        clusters,
        cluster,
        setCluster,
        addCluster,
        deleteCluster,
        getExplorerUrl,
      }}
    >
      {children}
    </ClusterContext.Provider>
  );
}

export function useCluster() {
  const context = useContext(ClusterContext);
  if (!context) {
    throw new Error("useCluster must be used within ClusterProvider");
  }
  return context;
}
