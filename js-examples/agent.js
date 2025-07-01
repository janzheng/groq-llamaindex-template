import { agent, multiAgent } from "@llamaindex/workflow";
import { groq } from "@llamaindex/groq";

// Define tools for the multiply agent
const multiplyTools = [
  {
    name: "multiply",
    description: "Multiply two numbers together",
    parameters: {
      type: "object",
      properties: {
        a: { type: "number", description: "First number to multiply" },
        b: { type: "number", description: "Second number to multiply" }
      },
      required: ["a", "b"]
    },
    handler: ({ a, b }) => a * b
  }
];

// Define tools for the calculator agent
const calculatorTools = [
  {
    name: "add",
    description: "Add two numbers together",
    parameters: {
      type: "object",
      properties: {
        a: { type: "number", description: "First number to add" },
        b: { type: "number", description: "Second number to add" }
      },
      required: ["a", "b"]
    },
    handler: ({ a, b }) => a + b
  },
  {
    name: "subtract",
    description: "Subtract second number from first number",
    parameters: {
      type: "object",
      properties: {
        a: { type: "number", description: "Number to subtract from" },
        b: { type: "number", description: "Number to subtract" }
      },
      required: ["a", "b"]
    },
    handler: ({ a, b }) => a - b
  }
];

const multiplyAgent = agent({
  name: "MultiplyAgent",
  llm: groq({ model: "llama-3.3-70b-versatile" }),
  tools: multiplyTools,
});

const calculatorAgent = agent({
  name: "CalculatorAgent",
  llm: groq({ model: "llama-3.3-70b-versatile" }),
  tools: calculatorTools,
  canHandoffTo: [multiplyAgent],
});

const agents = multiAgent({
  agents: [multiplyAgent, calculatorAgent],
  rootAgent: calculatorAgent,
});

const response = await agents.run(`Calculate the result of multiplying 5 and 3, then add 10 to the result.`);

console.log(response);