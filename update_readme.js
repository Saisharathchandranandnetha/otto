const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const readmePath = path.join(__dirname, 'README.md');

// Generate the exhaustive links list
let docsList = ``;
const categories = fs.readdirSync(docsDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== 'pdf')
  .map(d => d.name);

for (const category of categories) {
  docsList += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
  const catPath = path.join(docsDir, category);
  const files = fs.readdirSync(catPath).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const title = file.replace('.md', '').replace(/_/g, ' ');
    docsList += `- [${title}](docs/${category}/${file})\n`;
  }
  docsList += `\n`;
}

const readmeContent = `<div align="center">
  <img src="logo.png" alt="Otto Logo" width="200" />
  
  # Otto — The Autonomous AI Operator for Small Businesses
  
  *Software that installs itself in 3 minutes, then earns your trust like a real employee.*

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![Postgres](https://img.shields.io/badge/Postgres-16-blue)](https://www.postgresql.org/)
  [![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-purple)](https://openrouter.ai/)
</div>

---

## 📖 In-Depth Project Overview

Otto is a complete, production-grade backend and frontend platform designed to completely automate the operations of a small-to-medium business. Built for the **TakeOver'26 Hackathon**, Otto specifically tackles **Theme 2 (AI Automation & Intelligent Agents)** and **Theme 7 (Analytics & Decision Intelligence)**.

Unlike traditional AI wrappers that just serve as a chatbot, Otto is a state-aware, transactional, and semi-autonomous AI employee. It bridges the gap between chaotic, real-world data (handwritten invoices, unstructured WhatsApp messages) and rigid, structured enterprise resource planning (ERP).

---

## 🗺️ Project Structure

\`\`\`text
otto/
├── db/                         # Database scripts, seeders, and migrations
│   ├── migrations/             # SQL Migrations for Postgres
│   └── seed.ts                 # Demo seed script for populated testing
├── docs/                       # The massive 120+ document enterprise suite
│   ├── ai/                     # AI safety, RAG pipelines, evaluations
│   ├── architecture/           # C4 Models, System Designs
│   ├── api/                    # OpenAPI specs, Postman collections
│   ├── business/               # Lean canvas, Go-to-Market, ROI
│   ├── database/               # ER diagrams, Index strategies
│   ├── deployment/             # CI/CD, Docker, Rollback plans
│   ├── developer/              # Contribution guides, ADRs
│   ├── engineering/            # Code standards, Branching strategies
│   ├── operations/             # Runbooks, Incident response
│   ├── product/                # PRD, Vision, Story mapping
│   ├── reports/                # Changelogs, Engineering reports
│   ├── security/               # Threat models, OWASP checklist
│   ├── testing/                # End-to-end, API, Unit testing strategy
│   ├── user/                   # Admin & User guides
│   └── ux/                     # User flows, Accessibility
├── fixtures/                   # Shoebox Kit (test invoices, mock datasets)
├── public/                     # Static assets (logo, screenshots)
├── scripts/                    # Automation scripts (cache warming, evals)
└── src/
    ├── agent/                  # CORE: machine, gate, trust mechanisms
    ├── app/                    # Next.js App Router pages and API routes
    ├── components/             # Reusable UI React components
    ├── extract/                # Zod schemas, LLM integration, vision extraction
    ├── integrations/           # External API layers (Twilio WhatsApp, PDF Gen)
    └── lib/                    # Shared utilities, DB clients, SSE bus
\`\`\`

---

## 🧠 System Architecture & Flowcharts

To make the core ideas of Otto crystal clear, here are the detailed flowcharts and system designs powering the application:

### 1. The Resurrection (Zero-Typing Onboarding Flow)
\`\`\`mermaid
sequenceDiagram
    participant User
    participant Otto UI
    participant Vision Extractor
    participant OpenRouter LLM
    participant Postgres DB
    
    User->>Otto UI: Upload 15-20 photos of paper invoices & ledgers
    Otto UI->>Vision Extractor: Stream images
    Vision Extractor->>OpenRouter LLM: Prompt with Zod JSON Schema
    OpenRouter LLM-->>Vision Extractor: Strictly typed JSON (No Hallucinations)
    Vision Extractor->>Postgres DB: Entity Resolution (Merge duplicates)
    Postgres DB-->>Otto UI: Live Database Ready (3 mins)
    Otto UI-->>User: "Your digital business is ready."
\`\`\`

### 2. The Autonomy Ladder (Earned Trust Logic)
\`\`\`mermaid
stateDiagram-v2
    [*] --> HumanGated
    
    state HumanGated {
        StageAction --> AwaitApproval
        AwaitApproval --> ExecuteAction : Human Clicks Approve
        ExecuteAction --> IncrementTrustScore
    }
    
    HumanGated --> Autonomous : Trust Score > Threshold (e.g. 3 approvals)
    
    state Autonomous {
        AutoStage --> AutoExecute : Zero Human Input
        AutoExecute --> Logging
    }
    
    Autonomous --> HumanGated : One-Tap Revoke (Kill Switch)
    Autonomous --> Reversed : "Undo" within 1 hour
\`\`\`

### 3. Core System Architecture
\`\`\`mermaid
graph TD
    Client[Next.js App Router Client] --> API[Next.js API Routes]
    API --> AgentCore[Otto Agent Core]
    AgentCore --> Gate[Approval & Trust Gate]
    AgentCore --> Extractor[Zod-Locked Vision Extractor]
    
    Extractor <--> LLM[OpenRouter: GPT-4o / Gemini]
    Gate <--> DB[(Postgres 16 + pgvector)]
    
    AgentCore --> Integrations[External Integrations]
    Integrations --> Twilio[Twilio WhatsApp]
    Integrations --> PDFGen[Dynamic PDF Generation]
\`\`\`

---

## 🖼️ Application Walkthrough & Deep Dive

### 1. The Main Dashboard & Autonomous Feed
<div align="center">
  <img src="screenshot1.png" alt="Otto Dashboard Screenshot" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
</div>
<br>

*The main feed acts as Otto's brain. You can see staged actions (waiting for your approval), executed autonomous actions, and the current trust metrics. The dark theme with amber accents ensures critical approvals stand out instantly.*

### 2. Analytics & Workflow Execution
<div align="center">
  <img src="screenshot2.png" alt="Otto Workflow Execution Screenshot" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
</div>
<br>

*Otto doesn't just read data; it acts on it. By generating dynamic PDF purchase orders and interacting with the Twilio API, Otto seamlessly bridges the gap between software and real-world supplier communication.*

### 3. Real-time Process Visibility & Tracking
<div align="center">
  <img src="screenshot3.png" alt="Detailed Process Flow Screenshot" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
</div>
<br>

*This view provides a deep, granular look into Otto's internal processing. Whether it's mapping extracted invoice data to the underlying database schemas or visualizing the real-time execution of an autonomous workflow, this dashboard provides complete transparency into the "why" and "how" behind Otto's AI decisions.*

---

## 📚 The Complete Enterprise Documentation Suite

Below is the exhaustive list of the 120 enterprise-grade documentation files generated for this project. Every aspect of the software lifecycle has been painstakingly documented. Simply click any link to read the corresponding Markdown file in the repository.

${docsList}

---

## 🚀 Setup & Installation

### Prerequisites
* **Node.js** (v18.17.0 or higher)
* **Docker** (for running the local Postgres instance)
* **pnpm** package manager

### Running the App
\`\`\`bash
# 1. Install dependencies
pnpm approve-builds esbuild && pnpm install

# 2. Start Database & Run Migrations
pnpm db:up
pnpm db:migrate

# 3. Seed the Development Database ("Priya's Fashion" Demo Tenant)
pnpm db:seed

# 4. Start Development Server
pnpm dev
\`\`\`
Navigate to **http://localhost:3000** to view your Otto dashboard.

---

## 🤝 Contributing & License
We welcome open-source contributions! Please review our [Contribution Guide](docs/developer/Contribution_Guide.md) and [Coding Standards](docs/engineering/Coding_Standards.md) before opening a Pull Request.

This project is licensed under the **MIT License**.

<div align="center">
  <br>
  <i>Built to liberate small businesses from the terminal velocity of paperwork.</i>
</div>
`;

fs.writeFileSync(readmePath, readmeContent);
console.log('README updated successfully!');
