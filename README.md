# Groq + LlamaIndex AI Templates

[LlamaIndex](https://www.llamaindex.ai/) is a data framework for LLM-based applications that benefit from context augmentation, such as Retrieval-Augmented Generation (RAG) systems. LlamaIndex provides the essential abstractions to more easily ingest, structure, and access private or domain-specific data, resulting in safe and reliable injection into LLMs for more accurate text generation.

For more information, read the LlamaIndex Groq integration documentation for [Python](https://docs.llamaindex.ai/en/stable/examples/llm/groq.html) and [JavaScript](https://ts.llamaindex.ai/docs/llamaindex/modules/models/llms/groq).

## Overview

This collection shows how to build AI applications using Groq API for fast inference and LlamaIndex for AI orchestration in both **JavaScript** and **Python**. These are complete, working templates that you can fork, customize, and deploy.

**JavaScript Examples** (`js-examples/`):
- **RAG (rag.js):** Build Q&A systems that search through your documents and provide answers with source attribution - useful for knowledge bases and customer support
- **Data Extraction (data-extraction.js):** Convert unstructured text like meeting transcripts into structured JSON data with validated schemas - helpful for processing business communications  
- **AI Workflows (workflow.js):** Create multi-step AI processes that improve their outputs through self-critique and refinement - good for content generation tasks
- **AI Agent (agent.js):** Multi-agent system with tool calling capabilities, including handoff between specialized agents for complex mathematical operations

**Python Examples** (`py-examples/`):
- **AI Agent (main.py):** Function-calling agent that can perform mathematical operations using tools - demonstrates agent workflows with LlamaIndex Python

**What You'll Learn:**
By exploring these templates, you'll learn practical patterns for combining Groq's fast inference with LlamaIndex's orchestration capabilities in both JavaScript and Python. Each example includes logging, error handling, and real-world use cases that you can adapt for your own applications.

## Architecture

**Tech Stack:**
- **AI Framework:** LlamaIndex for orchestration and data processing
- **Language Models:** Groq API (Llama models)
- **Embeddings:** Hugging Face open source model (Xenova/all-mpnet-base-v2) for JavaScript
- **Schema Validation:** Zod for structured data extraction (JavaScript)
- **Runtime:** Node.js with ES modules (JavaScript) / Python 3.12+ (Python)
- **Package Management:** npm/yarn (JavaScript) / uv (Python)

**AI Pipeline:**
- **Document Processing:** Automatic chunking and indexing
- **Semantic Search:** Vector-based retrieval with relevance scoring
- **Response Generation:** Context-aware answers with source attribution
- **Workflow Orchestration:** Multi-step processes with state management
- **Agent Systems:** Tool-calling agents with multi-agent coordination

## Quick Start

### Prerequisites
- **For JavaScript:** Node.js 18+ and npm
- **For Python:** Python 3.12+ and [uv](https://docs.astral.sh/uv/) package manager
- **Groq API key:** [Create a free GroqCloud account and generate an API key here](https://console.groq.com)

### JavaScript Setup

1. **Navigate to JavaScript examples**
   ```bash
   cd groq-llamaindex/js-examples
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file with your API key
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

4. **Run the examples**
   ```bash
   # RAG Demo - Retrieval-Augmented Generation
   npm run rag
   
   # Data Extraction - Convert text to structured JSON
   npm run data-extraction
   
   # Workflow Demo - Multi-step AI process
   npm run workflow
   
   # Agent Demo - Multi-agent system with tool calling
   npm run agent
   ```

### Python Setup

1. **Navigate to Python examples**
   ```bash
   cd groq-llamaindex/py-examples
   ```

2. **Install dependencies**
   ```bash
   # Install dependencies (creates .venv automatically)
   uv sync
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file with your API key
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

4. **Run the example**
   ```bash
   # Agent Demo - Function-calling agent
   uv run main.py
   ```

## Examples

### JavaScript Examples

#### 1. RAG (Retrieval-Augmented Generation)

**File:** `js-examples/rag.js` | **Command:** `npm run rag`

A RAG implementation that shows how to build Q&A systems with source attribution:

- **Document Loading:** Processes text files into searchable chunks
- **Vector Embeddings:** Uses Hugging Face's open source Xenova/all-mpnet-base-v2 model for semantic search
- **Semantic Retrieval:** Finds relevant context with similarity scoring
- **Answer Generation:** Uses Groq's Llama models for context-aware responses
- **Source Attribution:** Shows which document sections were used with relevance scores

**Features:**
- Fast query responses
- Relevance scoring for retrieved chunks
- Multiple example queries included
- Error handling

#### 2. Structured Data Extraction

**File:** `js-examples/data-extraction.js` | **Command:** `npm run data-extraction`

Transform unstructured text (like sales call transcripts) into structured JSON data:

- **Schema Validation:** Uses Zod schemas for type-safe extraction
- **Multiple Methods:** Shows both schema-based and JSON object approaches
- **Real-world Example:** Processes sales call transcripts
- **Structured Output:** Extracts summaries, action items, participant names, and more

**Example Output:**
```json
{
  "summary": "Sales call discussing XYZ Widget automation tool...",
  "products": ["XYZ Widget"],
  "rep_name": "Sarah",
  "prospect_name": "John",
  "action_items": ["Send case studies", "Schedule demo"]
}
```

#### 3. AI Workflows

**File:** `js-examples/workflow.js` | **Command:** `npm run workflow`

Build multi-step AI processes with state management and iterative improvement:

- **Stateful Processing:** Maintains context across multiple steps
- **Iterative Refinement:** Improves outputs based on AI feedback
- **Event-Driven Architecture:** Clean separation of workflow steps
- **Configurable Limits:** Set maximum iterations and stopping conditions

**Example Flow:**
1. Generate initial joke about a topic
2. AI critiques the joke for quality
3. If improvement needed, refine the joke
4. Repeat until satisfactory or max iterations reached

#### 4. AI Agent System

**File:** `js-examples/agent.js` | **Command:** `npm run agent`

Multi-agent system with tool calling and agent handoff capabilities:

- **Multi-Agent Architecture:** Specialized agents for different tasks
- **Tool Calling:** Agents can use mathematical tools (add, subtract, multiply)
- **Agent Handoff:** Calculator agent can delegate multiplication tasks to multiply agent
- **Complex Problem Solving:** Handles multi-step mathematical operations

**Example Flow:**
1. Calculator agent receives complex math problem
2. Uses addition/subtraction tools directly
3. Hands off multiplication tasks to specialized multiply agent
4. Combines results for final answer

### Python Examples

#### AI Agent

**File:** `py-examples/main.py` | **Command:** `uv run main.py`

Function-calling agent that demonstrates tool usage in Python:

- **Function Agent:** Uses LlamaIndex's FunctionAgent workflow
- **Tool Integration:** Mathematical operations as callable tools
- **Async Processing:** Demonstrates async/await patterns
- **Simple Example:** Multiplication tool for mathematical operations

**Features:**
- Clean tool definition with type hints
- Async agent execution
- System prompt configuration
- Error handling

## Customization

This template serves as a foundation for your AI applications. Key areas for customization:

### JavaScript Customization
- **Model Selection:** Update Groq model configuration in each example file
- **Data Sources:** Replace `sample-data.txt` with your own documents for RAG
- **Extraction Schemas:** Modify Zod schemas in `data-extraction.js` for your data structure
- **Workflow Logic:** Customize the workflow steps and conditions in `workflow.js`
- **Agent Tools:** Add new tools and agents in `agent.js` for different capabilities
- **Embedding Models:** Switch between different Hugging Face embedding models for RAG

### Python Customization
- **Agent Tools:** Add more sophisticated tools beyond basic multiplication
- **Model Configuration:** Change the Groq model in the agent initialization
- **System Prompts:** Customize the agent's behavior and capabilities
- **Async Patterns:** Extend with more complex async workflows

## API Keys Required

- **Groq API Key:** Used for LLM inference across all examples in both JavaScript and Python

## Files Structure

```
groq-llamaindex/
├── js-examples/             # JavaScript examples
│   ├── .env                 # Stores your Groq API key
│   ├── rag.js               # RAG demo with semantic search
│   ├── data-extraction.js   # Structured data extraction
│   ├── workflow.js          # Multi-step AI workflow
│   ├── agent.js             # Multi-agent system with tools
│   ├── sample-data.txt      # Sample knowledge base
│   └── package.json         # JS dependencies and scripts
├── py-examples/             # Python examples
│   ├── .env                 # Stores your Groq API key
│   ├── main.py              # Function-calling agent
│   ├── pyproject.toml       # Python dependencies
│   └── uv.lock              # Lock file for uv
└── README.md                # This file
```

## Next Steps

### For Developers
- **Create your free GroqCloud account:** Access API docs, the playground, and more resources via [Groq Console](https://console.groq.com)
- **Explore LlamaIndex:** Check out the [LlamaIndex documentation](https://docs.llamaindex.ai/) for more features
- **Build and customize:** Fork this repo and start customizing for your own application
- **Get support:** Connect with other developers building on Groq, chat with our team, and submit feature requests on our [Groq Developer Forum](https://community.groq.com)

### For Founders and Business Leaders
- **See capabilities:** These templates show AI that can handle business workloads with fast response times
- **Discuss your needs:** [Contact our team](https://groq.com/enterprise-access/) to explore how Groq can help your AI initiatives

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Created by the Groq team using [LlamaIndex](https://llamaindex.ai) and [Groq](https://groq.com). 