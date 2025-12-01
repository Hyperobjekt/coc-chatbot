import { openai } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

/**
 * OpenAI Model Configuration
 * 
 * Model: gpt-4o-mini
 * - Optimized version of GPT-4 with better performance and lower cost
 * - Best for: General use, HMIS queries, data analysis
 * - Context: 128K tokens
 * - Cost: Much lower than standard GPT-4
 */

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Main chat model - handles user queries and HMIS data analysis
        "chat-model": openai("gpt-4o-mini"),
        
        // Model for extracting reasoning steps
        "chat-model-reasoning": wrapLanguageModel({
          model: openai("gpt-4o-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        
        // Quick title generation
        "title-model": openai("gpt-4o-mini"),
        
        // Artifact handling (code, sheets, etc)
        "artifact-model": openai("gpt-4o-mini"),
      },
    });
