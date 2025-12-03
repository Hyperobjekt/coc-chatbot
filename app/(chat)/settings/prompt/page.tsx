import { PromptSettings } from "@/components/prompt-settings";
import { regularPrompt } from "@/lib/ai/prompts";

export default function PromptSettingsPage() {
  return <PromptSettings defaultPrompt={regularPrompt} />;
}
