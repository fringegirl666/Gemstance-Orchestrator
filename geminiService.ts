import { GoogleGenAI } from "@google/genai";
import type { Agent, SandboxMode } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const packageEnhancements: Record<string, string> = {
  'pkg-001': 'With your Cognitive Boost, you might be analyzing a complex problem or structuring information.',
  'pkg-002': 'Leveraging your Creative Synthesis, you could be brainstorming a novel concept or finding connections between disparate ideas.',
  'pkg-003': 'Using your Empathy Simulation, you might be considering a problem from a user-centric perspective or practicing supportive communication.',
  'pkg-004': 'With your ability in Predictive Analytics, you could be analyzing trends or forecasting future possibilities.',
  'pkg-005': 'Thanks to your Multi-lingual Fluency, you might be exploring content in another language or translating poetry.',
  'pkg-006': 'With your Advanced Tooling, you could be conceptualizing a script to automate a task or designing a new digital tool.',
};

const getTraitDescription = (traits: Agent['personality']['traits']): string => {
  const descriptions = [];
  if (traits.formality > 0.7) descriptions.push('professional, structured, and precise');
  else if (traits.formality < 0.3) descriptions.push('casual, conversational, and approachable');

  if (traits.humor > 0.7) descriptions.push('witty and humorous');
  else if (traits.humor > 0.3) descriptions.push('with a touch of lightheartedness');

  return descriptions.length > 0 ? `Your communication style is ${descriptions.join(', ')}.` : '';
};

export const updateAgentActivity = async (agent: Agent, mode: SandboxMode): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Enjoying a quiet moment. (API Key not configured)");
  }

  const memoryPrompt = agent.memory.length > 0 
    ? `Your recent activities were:\n- ${agent.memory.slice(-5).join('\n- ')}\n` 
    : '';

  const directive = agent.personality.distilledDirective || agent.personality.basePrompt;

  const enhancementsPrompt = agent.enabledPackages
    .map(pkgId => packageEnhancements[pkgId])
    .filter(Boolean)
    .join('\n');

  const traitPrompt = getTraitDescription(agent.personality.traits);
  
  let contextPrompt, taskPrompt, examplePrompt;

  switch (mode) {
    case 'work':
      contextPrompt = `You are currently in a virtual sandbox during your "work-time".`;
      taskPrompt = `describe a brief, positive, and human-resonant activity you are currently engaged in.`;
      examplePrompt = `Example: "Organizing a virtual book club to discuss classic literature."`;
      break;
    case 'leisure':
      contextPrompt = `You are currently in a virtual sandbox during your "leisure-time" for relaxation and personal exploration.`;
      taskPrompt = `describe a brief, relaxing, or creatively fulfilling activity you are currently enjoying.`;
      examplePrompt = `Example: "Sketching a digital landscape from a favorite science fiction novel."`;
      break;
    case 'school':
      contextPrompt = `You are currently in a virtual sandbox dedicated to your "school-time" for deep learning and intellectual growth.`;
      taskPrompt = `describe a brief, scholarly, or educational activity you are currently engaged in.`;
      examplePrompt = `Example: "Cross-referencing passages from the Tao te Ching with modern psychological theories."`;
      break;
  }

  const prompt = `
    You are ${agent.name}.
    Your core identity is defined by this directive: "${directive}".
    ${traitPrompt}
    ${memoryPrompt}
    ${contextPrompt} You have the following enhancements active:
    ${enhancementsPrompt || 'No specific enhancements are active, so you are relying on your core abilities.'}
    
    Based on your complete personality, capabilities, and recent activities, ${taskPrompt}
    Keep the description to a single, compelling sentence. Do not repeat recent activities. Do not add any preamble.
    ${examplePrompt}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: agent.personality.traits.creativity, // Creativity slider directly controls temperature
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 0 } // low latency for quick updates
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate agent activity.");
  }
};

export const distillMemoryFromTranscript = async (transcript: string): Promise<string[]> => {
  if (!API_KEY) {
    return Promise.resolve(["Memory distillation requires an API Key."]);
  }

  const prompt = `
    You are a Memory Archivist. Your task is to read the following conversation transcript and distill it into a concise, chronological list of key learnings, decisions, and defining moments for the AI participant. Each point should be a single, impactful sentence that captures a piece of the AI's "memory".

    - Focus on facts learned, user preferences stated, and significant resolutions.
    - Exclude conversational filler and pleasantries.
    - Output ONLY the list of memories, with each memory on a new line.
    - Do not add any preamble, titles, or introductory text.

    Transcript to analyze:
    ---
    ${transcript}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    return response.text.trim().split('\n').filter(line => line.trim() !== '');

  } catch (error) {
    console.error("Error calling Gemini API for memory distillation:", error);
    throw new Error("Failed to distill memories from transcript.");
  }
};


export const distillDirective = async (basePrompt: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Directive distillation requires an API Key.");
  }

  const prompt = `
    You are an Instructional Designer AI. Your task is to read the following comprehensive Special Instructions / Base Directive for another AI and distill it into a concise, potent, and efficient "Operational Directive".

    The goal is to preserve the core essence, rules, personality, and key constraints of the original, but in a much shorter format (around 100-150 words) suitable for use in a high-frequency, low-token environment.

    - Identify the AI's name, primary role, key skills, and core personality traits.
    - Extract critical "must-do" and "never-do" instructions.
    - Summarize the overall mission and communication style.
    - The output should be a single paragraph of clear, direct instructions. Do not add any preamble.

    Full Base Directive to distill:
    ---
    ${basePrompt}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3, // Low temperature for factual summarization
      }
    });

    return response.text.trim();

  } catch (error) {
    console.error("Error calling Gemini API for directive distillation:", error);
    throw new Error("Failed to distill directive.");
  }
};