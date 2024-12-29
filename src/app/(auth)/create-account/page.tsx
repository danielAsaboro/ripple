// File: /app/create-account/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { RefreshCw } from "lucide-react";
import { generateUsernameSuggestions } from "@/utils/username";
import { useUser } from "@/contexts/UserProvider";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { toast } from "react-hot-toast";

export default function CreateAccountPage() {
  const router = useRouter();
  const { connected } = useWallet();
  const { user, initialized, initializeUser, loading } = useUser();
  const [username, setUsername] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState(false);

  // If user is already initialized, redirect to dashboard
  useEffect(() => {
    if (initialized && user) {
      router.push("/dashboard");
    }
  }, [initialized, user, router]);

  // Generate initial suggestions
  useEffect(() => {
    refreshSuggestions();
  }, []);

  const refreshSuggestions = () => {
    setSuggestions(generateUsernameSuggestions(5));
  };

  const handleSubmit = async () => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!username.trim()) {
      toast.error("Please select or enter a username");
      return;
    }

    try {
      await initializeUser(username);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-slate-400">
              Choose a username to get started with your donation journey
            </p>
          </div>

          {!connected ? (
            <div className="text-center space-y-4">
              <p className="text-slate-400">
                Please connect your wallet to continue
              </p>
              <div className="flex justify-center">
                <ConnectWalletButton />
              </div>
            </div>
          ) : (
            <>
              {!customInput ? (
                <>
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setUsername(suggestion)}
                        className={`w-full p-3 rounded-lg border ${
                          username === suggestion
                            ? "border-green-400 bg-green-400/10 text-green-400"
                            : "border-slate-700 hover:border-slate-600 text-white"
                        } transition-colors`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={refreshSuggestions}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCustomInput(true)}
                    >
                      Create Custom
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter custom username"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setCustomInput(false)}
                    className="w-full"
                  >
                    Back to Suggestions
                  </Button>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!username.trim() || loading}
                  className="w-full"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </>
          )}

          <div className="text-center text-sm text-slate-400">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="text-green-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-green-400 hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
