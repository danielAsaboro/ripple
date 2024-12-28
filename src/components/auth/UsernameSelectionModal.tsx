// src/components/auth/UsernameSelectionModal.tsx
import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { generateUsernameSuggestions } from "@/utils/username";

interface UsernameSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
  loading?: boolean;
}

export const UsernameSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: UsernameSelectionModalProps) => {
  const [username, setUsername] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      refreshSuggestions();
    }
  }, [isOpen]);

  const refreshSuggestions = () => {
    setSuggestions(generateUsernameSuggestions(5));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">
              Choose Your Username
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Select a suggested username or create your own
            </p>
          </div>

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
                <Button variant="outline" onClick={() => setCustomInput(true)}>
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

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(username)}
              disabled={!username.trim() || loading}
              className="flex-1"
            >
              {loading ? "Creating..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
