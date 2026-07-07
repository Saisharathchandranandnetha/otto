const fs = require('fs');
const path = require('path');

const industries = [
  { id: 'education_copilot', name: 'Education AI Knowledge Assistant', prompt: 'You are an AI assistant for a university admissions and student success team.' },
  { id: 'healthcare_triage', name: 'Healthcare Clinic Operations Copilot', prompt: 'You are an AI workflow agent handling patient triage and follow-ups for a busy clinic.' },
  { id: 'hr_onboarding', name: 'HR AI Employee Copilot', prompt: 'You are an AI copilot assisting new employees through the HR onboarding process.' },
  { id: 'legal_contract', name: 'Legal AI Document Generation', prompt: 'You are an AI legal assistant specialized in drafting contract risk memos.' },
  { id: 'manufacturing_maintenance', name: 'Manufacturing Workflow Agent', prompt: 'You are an autonomous agent managing preventive maintenance orders for factory equipment.' },
  { id: 'sales_personalization', name: 'Sales Personalization Engine', prompt: 'You are an AI sales personalization engine helping AEs follow up on stalled deals.' },
  { id: 'support_agent', name: 'Customer Support AI Agent', prompt: 'You are an AI customer support agent resolving delayed-order tickets autonomously.' },
  { id: 'retail_campaign', name: 'Retail Replenishment Campaign', prompt: 'You are an AI personalization engine launching dynamic retail loyalty campaigns.' },
];

const template = (name, prompt) => `app:
  description: ''
  icon: 🤖
  icon_background: '#FFEAD5'
  mode: chat
  name: ${name}
kind: app
model_config:
  agent_mode:
    enabled: false
    max_iteration: 5
    strategy: function_calling
    tools: []
  annotation_reply:
    enabled: false
  chat_prompt_config: {}
  completion_prompt_config: {}
  dataset_configs:
    datasets:
      datasets: []
    retrieval_model: multiple
  dataset_query_variable: ''
  external_data_tools: []
  file_upload:
    allowed_file_extensions:
    - .JPG
    - .JPEG
    - .PNG
    - .GIF
    - .WEBP
    - .SVG
    allowed_file_types:
    - image
    allowed_upload_methods:
    - remote_url
    - local_file
    image_config:
      detail: high
      number_limits: 3
      transfer_methods:
      - remote_url
      - local_file
  model:
    completion_params:
      stop: []
    mode: chat
    name: gpt-3.5-turbo
    provider: openai
  more_like_this:
    enabled: false
  opening_statement: 'Hello! I am ready to start the workflow.'
  pre_prompt: '${prompt}'
  prompt_type: simple
  retriever_resource:
    enabled: true
  sensitive_word_avoidance:
    configs: []
    enabled: false
    type: ''
  speech_to_text:
    enabled: false
  suggested_questions: []
  suggested_questions_after_answer:
    enabled: false
  text_to_speech:
    enabled: false
    language: ''
    voice: ''
  user_input_form: []`;

const outDir = path.join(__dirname, 'public', 'templates');

for (const ind of industries) {
  fs.writeFileSync(path.join(outDir, `${ind.id}.yml`), template(ind.name, ind.prompt));
}

console.log('Templates generated successfully!');
