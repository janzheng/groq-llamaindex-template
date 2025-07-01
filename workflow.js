import { groq } from "@llamaindex/groq";
import {
  createStatefulMiddleware,
  createWorkflow,
  workflowEvent,
} from "@llamaindex/workflow";
import dotenv from "dotenv";

dotenv.config();

// Create LLM instance
const llm = groq({
  model: "meta-llama/llama-4-maverick-17b-128e-instruct",
});

// Define our workflow events
const startEvent = workflowEvent(); // Input topic for joke
const jokeEvent = workflowEvent(); // Intermediate joke
const critiqueEvent = workflowEvent(); // Intermediate critique
const resultEvent = workflowEvent(); // Final joke + critique

// Create our workflow
const { withState, getContext } = createStatefulMiddleware(() => ({
  numIterations: 0,
  maxIterations: 3,
}));

const jokeFlow = withState(createWorkflow());

// Define handlers for each step
jokeFlow.handle([startEvent], async (event) => {
  console.log(`🎭 Starting joke generation about: ${event.data}`);
  
  // Prompt the LLM to write a joke
  const prompt = `Write your best joke about ${event.data}. Write the joke between <joke> and </joke> tags.`;
  const response = await llm.complete({ prompt });
  
  // Parse the joke from the response
  const joke =
    response.text.match(/<joke>([\s\S]*?)<\/joke>/)?.[1]?.trim() ??
    response.text;
  
  console.log(`📝 Initial joke generated: "${joke}"`);
  return jokeEvent.with({ joke: joke });
});

jokeFlow.handle([jokeEvent], async (event) => {
  const state = getContext().state;
  console.log(`🔍 Critiquing joke (iteration ${state.numIterations + 1}): "${event.data.joke}"`);
  
  // Prompt the LLM to critique the joke
  const prompt = `Give a thorough critique of the following joke. If the joke needs improvement, put "IMPROVE" somewhere in the critique: ${event.data.joke}`;
  const response = await llm.complete({ prompt });
  
  console.log(`💭 Critique received (length: ${response.text.length} chars)`);
  
  // If the critique includes "IMPROVE", keep iterating, else, return the result
  if (response.text.includes("IMPROVE")) {
    console.log(`⚠️  Critique suggests improvement needed. Moving to refinement...`);
    return critiqueEvent.with({
      joke: event.data.joke,
      critique: response.text,
    });
  }
  
  console.log(`✅ Critique approves the joke! Workflow complete.`);
  return resultEvent.with({ joke: event.data.joke, critique: response.text });
});

jokeFlow.handle([critiqueEvent], async (event) => {
  // Keep track of the number of iterations
  const state = getContext().state;
  state.numIterations++;
  
  console.log(`🔧 Refining joke (attempt ${state.numIterations}/${state.maxIterations})`);
  console.log(`📋 Previous joke: "${event.data.joke}"`);
  
  // Write a new joke based on the previous joke and critique
  const prompt = `Write a new joke based on the following critique and the original joke. Write the joke between <joke> and </joke> tags.\n\nJoke: ${event.data.joke}\n\nCritique: ${event.data.critique}`;
  const response = await llm.complete({ prompt });
  
  // Parse the joke from the response
  const joke =
    response.text.match(/<joke>([\s\S]*?)<\/joke>/)?.[1]?.trim() ??
    response.text;
  
  console.log(`🆕 Refined joke: "${joke}"`);
  
  // If we've done less than the max number of iterations, keep iterating
  // else, return the result
  if (state.numIterations < state.maxIterations) {
    console.log(`🔄 Sending refined joke back for another critique...`);
    return jokeEvent.with({ joke: joke });
  }
  
  console.log(`🏁 Max iterations reached. Returning final result.`);
  return resultEvent.with({ joke: joke, critique: event.data.critique });
});

// Usage
async function main() {
  console.log("🚀 Starting Joke Improvement Workflow");
  console.log("=" .repeat(50));
  
  const { stream, sendEvent } = jokeFlow.createContext();
  sendEvent(startEvent.with("pirates"));
  let result;
  for await (const event of stream) {
    console.log(event.data); 
    if (resultEvent.include(event)) {
      result = event.data;
      break; // Stop when we get the final result
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("🎉 FINAL RESULT:");
  console.log("=".repeat(50));
  console.log(`📖 Final Joke: "${result.joke}"`);
  console.log(`\n📝 Final Critique:\n${result.critique}`);
}

main().catch(console.error);
