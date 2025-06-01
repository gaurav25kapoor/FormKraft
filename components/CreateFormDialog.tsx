"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function CreateFormDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!prompt.trim()) {
      setError("Prompt cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", prompt.trim());

      const res = await fetch("/api/forms", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create form");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLoading(false);
      setOpen(false);
      setPrompt("");
      router.push(`/dashboard/forms/edit/${data.id}`);
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Plus /> Create New Form
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a prompt</DialogTitle>
          <DialogDescription>
            Write a clean prompt to get better results.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <textarea
            className="w-full p-2 border rounded-md resize-none"
            rows={4}
            placeholder="Enter your prompt here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Form"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
