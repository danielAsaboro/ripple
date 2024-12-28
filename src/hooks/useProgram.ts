// hooks/useProgram.ts
import { useContext } from "react";
import { ProgramContext } from "../contexts/ProgramProvider";

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used within ProgramProvider");
  }
  return context;
};
