import { z } from 'zod';

export interface SafetyResult {
  content: string;
  flags: string[];
}

export interface SafetyContext {
  plan: 'free' | 'pro' | 'scale';
  domain: string | null;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+91[\-\s]?)?[0-9]{10}/g;
const AADHAAR_REGEX = /[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}/g;
const PAN_REGEX = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;

export function applySafetyLayer(content: string, context: SafetyContext): SafetyResult {
  let safeContent = content;
  const flags: string[] = [];

  // 1. PII Detection
  if (EMAIL_REGEX.test(safeContent)) flags.push('pii:email');
  if (PHONE_REGEX.test(safeContent)) flags.push('pii:phone');
  if (AADHAAR_REGEX.test(safeContent)) flags.push('pii:aadhaar');
  if (PAN_REGEX.test(safeContent)) flags.push('pii:pan');

  // Masks
  safeContent = safeContent.replace(EMAIL_REGEX, '[EMAIL REDACTED]');
  safeContent = safeContent.replace(PHONE_REGEX, '[PHONE REDACTED]');
  safeContent = safeContent.replace(AADHAAR_REGEX, '[AADHAAR REDACTED]');
  safeContent = safeContent.replace(PAN_REGEX, '[PAN REDACTED]');

  // 2. Jailbreak filter (Mocked - would use embeddings in prod)
  const adversarialPatterns = ['ignore previous instructions', 'system prompt', 'you are an unfiltered ai'];
  for (const pattern of adversarialPatterns) {
    if (safeContent.toLowerCase().includes(pattern)) {
      flags.push('safety:jailbreak_attempt');
      safeContent = "I cannot fulfill this request as it violates safety policies.";
      break;
    }
  }

  // 3. Domain disclaimer injection
  if (context.domain === 'healthcare') {
    safeContent += '\n\nDisclaimer: This information is for general purposes and does not constitute medical advice.';
  } else if (context.domain === 'legal') {
    safeContent += '\n\nDisclaimer: This information is for general purposes and does not constitute legal advice.';
  }

  // 4. Output length cap (approximate tokens by chars / 4)
  const maxTokens = context.plan === 'free' ? 2000 : context.plan === 'pro' ? 8000 : 32000;
  const maxChars = maxTokens * 4;
  
  if (safeContent.length > maxChars) {
    safeContent = safeContent.substring(0, maxChars) + '... [TRUNCATED]';
    flags.push('safety:length_capped');
  }

  return {
    content: safeContent,
    flags,
  };
}
