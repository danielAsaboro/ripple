//File: /components/auth/CreateUserPrompt.tsx
import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { useUser } from "@/contexts/UserProvider";

export const CreateUserPrompt = () => {
  const { initializeUser, loading } = useUser();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await initializeUser(name);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-white mb-4">
        Complete Your Profile
      </h2>
      <p className="text-slate-400 mb-6">
        Please create your profile to continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-200 mb-1"
          >
            Display Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your name"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Profile..." : "Create Profile"}
        </Button>
      </form>
    </Card>
  );
};
