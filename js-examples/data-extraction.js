import { groq } from "@llamaindex/groq";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();


// Example sales call transcript
const transcript =
  "[Phone rings]\n\nJohn: Hello, this is John.\n\nSarah: Hi John, this is Sarah from XYZ Company. I'm calling to discuss our new product, the XYZ Widget, and see if it might be a good fit for your business.\n\nJohn: Hi Sarah, thanks for reaching out. I'm definitely interested in learning more about the XYZ Widget. Can you give me a quick overview of what it does?\n\nSarah: Of course! The XYZ Widget is a cutting-edge tool that helps businesses streamline their workflow and improve productivity. It's designed to automate repetitive tasks and provide real-time data analytics to help you make informed decisions.\n\nJohn: That sounds really interesting. I can see how that could benefit our team. Do you have any case studies or success stories from other companies who have used the XYZ Widget?\n\nSarah: Absolutely, we have several case studies that I can share with you. I'll send those over along with some additional information about the product. I'd also love to schedule a demo for you and your team to see the XYZ Widget in action.\n\nJohn: That would be great. I'll make sure to review the case studies and then we can set up a time for the demo. In the meantime, are there any specific action items or next steps we should take?\n\nSarah: Yes, I'll send over the information and then follow up with you to schedule the demo. In the meantime, feel free to reach out if you have any questions or need further information.\n\nJohn: Sounds good, I appreciate your help Sarah. I'm looking forward to learning more about the XYZ Widget and seeing how it can benefit our business.\n\nSarah: Thank you, John. I'll be in touch soon. Have a great day!\n\nJohn: You too, bye.";

// Define the schema for structured data extraction
const exampleSchema = z.object({
  summary: z.string(),
  products: z.array(z.string()),
  rep_name: z.string(),
  prospect_name: z.string(),
  action_items: z.array(z.string()),
});

// Example of the expected output format
const example = {
  summary:
    "High-level summary of the call transcript. Should not exceed 3 sentences.",
  products: ["product 1", "product 2"],
  rep_name: "Name of the sales rep",
  prospect_name: "Name of the prospect",
  action_items: ["action item 1", "action item 2"],
};

async function main() {
  const llm = groq({
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
  });

  console.log("Extracting structured data from sales call transcript using Groq...\n");

  try {
    // Method 1: Using Zod schema for response format
    console.log("Method 1: Using Zod schema for structured extraction");
    const response = await llm.chat({
      messages: [
        {
          role: "system",
          content: `You are an expert assistant for summarizing and extracting insights from sales call transcripts. 
          
Extract the following information from the transcript:
- summary: A high-level summary of the call (max 3 sentences)
- products: List of products mentioned
- rep_name: Name of the sales representative
- prospect_name: Name of the prospect/customer
- action_items: List of action items or next steps mentioned

Respond with valid JSON only.`,
        },
        {
          role: "user",
          content: `Here is the transcript: \n------\n${transcript}\n------`,
        },
      ],
      responseFormat: exampleSchema,
    });

    console.log("Structured extraction result:");
    console.log(response.message.content);
    console.log("\n" + "=".repeat(50) + "\n");

    // Method 2: Using JSON object format with example
    console.log("Method 2: Using JSON object format with example");
    const response2 = await llm.chat({
      messages: [
        {
          role: "system",
          content: `You are an expert assistant for summarizing and extracting insights from sales call transcripts.

Generate a valid JSON in the following format:

${JSON.stringify(example, null, 2)}

Extract the actual information from the transcript and replace the example values.`,
        },
        {
          role: "user",
          content: `Here is the transcript: \n------\n${transcript}\n------`,
        },
      ],
      responseFormat: { type: "json_object" },
    });

    console.log("JSON object extraction result:");
    console.log(response2.message.content);

  } catch (error) {
    console.error("Error during structured data extraction:", error);
  }
}

void main().then(() => {
  console.log("\nStructured data extraction completed!");
});