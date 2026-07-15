# C4 Context Diagram

## Overview
This diagram illustrates the system context for Otto, showing the boundaries between the users, the Otto application, and external third-party systems.

## Diagram
```mermaid
C4Context
    title System Context diagram for Otto AI Operator
    
    Person(user, "Small Business Owner", "A business owner who uses Otto to automate and manage daily operations.")
    
    System(otto, "Otto System", "AI operator platform that automates workflows, handles document ingestion, and manages domain-specific tasks via an Autonomy Ladder.")
    
    System_Ext(openrouter, "OpenRouter (GPT-4o)", "External LLM API used for batch vision extraction and entity resolution.")
    
    System_Ext(twilio, "Twilio", "External communication service used to send WhatsApp messages to customers or suppliers.")
    
    Rel(user, otto, "Views feed, approves actions, and uploads documents", "HTTPS")
    Rel(otto, openrouter, "Sends images/text and receives structured JSON", "HTTPS/API")
    Rel(otto, twilio, "Sends notifications and messages", "HTTPS/API")
```
