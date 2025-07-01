import fs from "node:fs/promises";
import { Groq } from "@llamaindex/groq";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";
import {
  Document,
  MetadataMode,
  Settings,
  VectorStoreIndex,
} from "llamaindex";
import dotenv from "dotenv";

dotenv.config();

// Configure LlamaIndex to use Groq for LLM and HuggingFace for embeddings
Settings.llm = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

Settings.embedModel = new HuggingFaceEmbedding({
  modelType: "Xenova/all-mpnet-base-v2",
});

async function main() {
  console.log("🚀 Starting RAG Demo with Groq + HuggingFace Embeddings");
  console.log("=".repeat(60));
  
  try {
    // Load sample data
    const path = "sample-data.txt";
    console.log(`📖 Loading document from: ${path}`);
    const essay = await fs.readFile(path, "utf-8");
    
    // Create Document object with essay
    const document = new Document({ text: essay, id_: path });
    console.log(`📄 Document loaded (${essay.length} characters)`);
    
    // Split text and create embeddings. Store them in a VectorStoreIndex
    console.log("🔍 Creating embeddings and building vector index...");
    const index = await VectorStoreIndex.fromDocuments([document]);
    console.log("✅ Vector index created successfully!");
    
    // Create query engine
    const queryEngine = index.asQueryEngine();
    
    // Define some example queries
    const queries = [
      "What did the author do in college?",
      "How did the author get started with programming?",
      "What was Viaweb and how did it work?",
      "Why did the author start Y Combinator?",
      "What advice does the author give about working on unprestigious things?"
    ];
    
    console.log("\n" + "=".repeat(60));
    console.log("🎯 Running RAG Queries");
    console.log("=".repeat(60));
    
    // Process each query
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`\n🔍 Query ${i + 1}: "${query}"`);
      console.log("-".repeat(40));
      
      try {
        // Query the index
        const { message, sourceNodes } = await queryEngine.query({
          query: query,
        });
        
        // Output response
        console.log(`💡 Answer: ${message.content}`);
        
        // Output sources with relevance scores
        if (sourceNodes && sourceNodes.length > 0) {
          console.log(`\n📚 Sources (${sourceNodes.length} found):`);
          sourceNodes.forEach((source, index) => {
            const score = source.score ? source.score.toFixed(4) : "N/A";
            const content = source.node.getContent(MetadataMode.NONE);
            const preview = content.length > 100 
              ? content.substring(0, 100) + "..." 
              : content;
            console.log(`   ${index + 1}. Score: ${score} - ${preview}`);
          });
        }
        
        console.log("\n" + "·".repeat(40));
        
      } catch (error) {
        console.error(`❌ Error processing query: ${error.message}`);
      }
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("🎉 RAG Demo Complete!");
    console.log("=".repeat(60));
    
  } catch (error) {
    console.error("❌ Error in RAG demo:", error.message);
    
    if (error.message.includes("GROQ_API_KEY")) {
      console.log("\n💡 Make sure to set your GROQ_API_KEY in your .env file for the LLM");
    }
  }
}

// Interactive query function for testing
export async function queryRAG(question, dataPath = "sample-data.txt") {
  try {
    const essay = await fs.readFile(dataPath, "utf-8");
    const document = new Document({ text: essay, id_: dataPath });
    const index = await VectorStoreIndex.fromDocuments([document]);
    const queryEngine = index.asQueryEngine();
    
    const { message, sourceNodes } = await queryEngine.query({
      query: question,
    });
    
    return {
      answer: message.content,
      sources: sourceNodes?.map(source => ({
        score: source.score,
        content: source.node.getContent(MetadataMode.NONE).substring(0, 200) + "..."
      })) || []
    };
  } catch (error) {
    throw new Error(`RAG query failed: ${error.message}`);
  }
}

main().catch(console.error);
