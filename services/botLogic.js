import { generateCaseId } from "../utils/caseIdGenerator.js";

export const handleUserMessage = (message, userId) => {
  const text = message.toLowerCase();

  if (text.includes("where is my order")) {
    return {
      reply: "Please enter your order ID.",
      caseId: generateCaseId()
    };
  }

  if (/^\d{6,}$/.test(text)) {
    return {
      reply: `Order ${message} is currently ‘In Transit’ and expected to arrive on July 5. [Track here](#)`,
      caseId: generateCaseId()
    };
  }

  if (text.includes("return")) {
    return {
      reply: "To return a product, visit our return center and fill the form. Read our return policy here: [link]",
      caseId: generateCaseId()
    };
  }

  if (!reply) {
  const lower = message.toLowerCase();
  if (lower.includes("where is my order")) {
    reply = "Please provide your order ID so I can check the status.";
  } else if (lower.includes("return")) {
    reply = "To return a product, visit our returns page and follow the instructions.";
  } else {
    reply = "I’m not sure how to respond to that right now.";
  }
}


  return {
    reply: "Sorry, I didn't understand that. Can you please rephrase?",
    caseId: null
  };
};
