"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { regularPrompt } from "@/lib/ai/prompts";
import { toast } from "./toast";

export function PromptSettings() {
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch("/api/prompt");
        const data = await response.json();
        setCustomPrompt(data.customPrompt);
      } catch (error) {
        console.error("Error fetching custom prompt:", error);
        toast({
          type: "error",
          description: "Failed to load custom prompt",
        });
      }
    };

    fetchPrompt();
  }, []);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/prompt", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to save prompt");
      }

      toast({
        type: "success",
        description: "Prompt saved successfully",
      });
    } catch (error) {
      console.error("Error saving custom prompt:", error);
      toast({
        type: "error",
        description: "Failed to save prompt",
      });
    } finally {
      setIsLoading(false);
    }
  }, [customPrompt]);

  const handleReset = useCallback(() => {
    setCustomPrompt(null);
  }, []);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-2xl">Prompt Settings</h1>
        <p className="text-muted-foreground">
          Customize the base prompt used by the AI assistant. This will be
          automatically enhanced with database documentation and location
          context.
        </p>
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium" htmlFor="customPrompt">
          Custom Prompt
        </label>
        <Textarea
          className="min-h-[400px] font-mono text-sm"
          id="customPrompt"
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter your custom prompt..."
          value={customPrompt ?? regularPrompt}
        />
      </div>

      <div className="flex gap-4">
        <Button disabled={isLoading} onClick={handleSave}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          disabled={isLoading || !customPrompt}
          onClick={handleReset}
          variant="outline"
        >
          Reset to Default
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 font-semibold text-lg">About Custom Prompts</h2>
        <div className="rounded-lg border bg-muted/50 p-4 text-muted-foreground text-sm">
          <p className="mb-2">
            The prompt you define here will be used as the base instructions for
            the AI assistant. It will be automatically enhanced with:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>Geographic context (user&apos;s location)</li>
            <li>Database schema documentation</li>
            <li>Lookup tables reference</li>
            <li>Example queries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
