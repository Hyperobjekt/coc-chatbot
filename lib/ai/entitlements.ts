import type { UserType } from "@/app/(auth)/auth";
import type { ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account - unlimited for internal HMIS use
   */
  guest: {
    maxMessagesPerDay: 999999,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * For users with an account - unlimited for internal HMIS use
   */
  regular: {
    maxMessagesPerDay: 999999,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
};
