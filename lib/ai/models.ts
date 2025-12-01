export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "GPT-4o Mini",
    description: "Fast and efficient model optimized for HMIS data analysis",
  },
  {
    id: "chat-model-reasoning",
    name: "GPT-4o Mini (Reasoning)",
    description:
      "Uses chain-of-thought reasoning for complex HMIS queries",
  },
];
