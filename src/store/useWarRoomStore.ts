import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Scenario = 'cold_call' | 'discovery' | 'objection' | 'proposal' | 'closing';
export type SessionStatus = 'idle' | 'active' | 'coaching' | 'ended';
export type AIProvider = 'openai' | 'anthropic' | 'local';

export interface KnowledgeDoc {
  id: string;
  name: string;
  content: string;
  addedAt: string;
  enabled: boolean;
}

// Document content is stored in individual localStorage keys to avoid the
// ~5MB single-key limit. Zustand only persists metadata (id, name, addedAt).
const DOC_CONTENT_PREFIX = 'war-room-doc-content-';

export function saveDocContent(id: string, content: string) {
  localStorage.setItem(DOC_CONTENT_PREFIX + id, content);
}

export function loadDocContent(id: string): string {
  return localStorage.getItem(DOC_CONTENT_PREFIX + id) ?? '';
}

export function deleteDocContent(id: string) {
  localStorage.removeItem(DOC_CONTENT_PREFIX + id);
}

export interface DocMeta {
  id: string;
  name: string;
  addedAt: string;
  enabled: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SessionSummary {
  id: string;
  scenario: Scenario;
  date: string;
  messageCount: number;
  feedback: string;
}

interface WarRoomState {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  selectedVoice: string;
  selectedScenario: Scenario;
  messages: Message[];
  status: SessionStatus;
  isSpeaking: boolean;
  isListening: boolean;
  feedback: string;
  sessionHistory: SessionSummary[];
  // Runtime only — content loaded from individual localStorage keys
  knowledgeDocs: KnowledgeDoc[];
  // Persisted metadata index
  knowledgeMeta: DocMeta[];

  setProvider: (p: AIProvider) => void;
  setApiKey: (key: string) => void;
  setBaseUrl: (url: string) => void;
  setModel: (model: string) => void;
  setSelectedVoice: (voice: string) => void;
  setSelectedScenario: (scenario: Scenario) => void;
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  setStatus: (status: SessionStatus) => void;
  setIsSpeaking: (val: boolean) => void;
  setIsListening: (val: boolean) => void;
  setFeedback: (text: string) => void;
  addSessionToHistory: (summary: SessionSummary) => void;
  resetSession: () => void;
  addKnowledgeDoc: (doc: KnowledgeDoc) => void;
  removeKnowledgeDoc: (id: string) => void;
  toggleKnowledgeDoc: (id: string) => void;
  hydrateKnowledgeDocs: () => void;
}

export const PROVIDER_DEFAULTS: Record<AIProvider, { baseUrl: string; model: string; label: string }> = {
  openai:    { baseUrl: 'https://api.openai.com/v1',    model: 'gpt-4o',               label: 'OpenAI' },
  anthropic: { baseUrl: 'https://api.anthropic.com/v1', model: 'claude-opus-4-6',       label: 'Anthropic' },
  local:     { baseUrl: 'http://localhost:11434/v1',     model: 'llama3',               label: 'Local (Ollama/LM Studio)' },
};

export const useWarRoomStore = create<WarRoomState>()(
  persist(
    (set, get) => ({
      provider: 'openai',
      apiKey: '',
      baseUrl: PROVIDER_DEFAULTS.openai.baseUrl,
      model: PROVIDER_DEFAULTS.openai.model,
      selectedVoice: '',
      selectedScenario: 'cold_call',
      messages: [],
      status: 'idle',
      isSpeaking: false,
      isListening: false,
      feedback: '',
      sessionHistory: [],
      knowledgeDocs: [],
      knowledgeMeta: [],

      setProvider: (provider) => set({
        provider,
        baseUrl: PROVIDER_DEFAULTS[provider].baseUrl,
        model: PROVIDER_DEFAULTS[provider].model,
      }),
      setApiKey: (key) => set({ apiKey: key }),
      setBaseUrl: (url) => set({ baseUrl: url }),
      setModel: (model) => set({ model }),
      setSelectedVoice: (voice) => set({ selectedVoice: voice }),
      setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
      setMessages: (msgs) => set({ messages: msgs }),
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      setStatus: (status) => set({ status }),
      setIsSpeaking: (val) => set({ isSpeaking: val }),
      setIsListening: (val) => set({ isListening: val }),
      setFeedback: (text) => set({ feedback: text }),
      addSessionToHistory: (summary) =>
        set((s) => ({ sessionHistory: [summary, ...s.sessionHistory].slice(0, 20) })),
      resetSession: () => set({ messages: [], status: 'idle', feedback: '', isListening: false, isSpeaking: false }),

      addKnowledgeDoc: (doc) => {
        saveDocContent(doc.id, doc.content);
        const meta: DocMeta = { id: doc.id, name: doc.name, addedAt: doc.addedAt, enabled: doc.enabled };
        set((s) => ({
          knowledgeDocs: [...s.knowledgeDocs, doc],
          knowledgeMeta: [...s.knowledgeMeta, meta],
        }));
      },

      removeKnowledgeDoc: (id) => {
        deleteDocContent(id);
        set((s) => ({
          knowledgeDocs: s.knowledgeDocs.filter(d => d.id !== id),
          knowledgeMeta: s.knowledgeMeta.filter(m => m.id !== id),
        }));
      },

      toggleKnowledgeDoc: (id) => {
        set((s) => {
          const docs = s.knowledgeDocs.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d);
          const meta = s.knowledgeMeta.map(m => m.id === id ? { ...m, enabled: !docs.find(d => d.id === id)!.enabled } : m);
          return { knowledgeDocs: docs, knowledgeMeta: meta };
        });
      },

      hydrateKnowledgeDocs: () => {
        const { knowledgeMeta } = get();
        const docs: KnowledgeDoc[] = knowledgeMeta.map(m => ({
          ...m,
          content: loadDocContent(m.id),
          enabled: m.enabled ?? true,
        }));
        set({ knowledgeDocs: docs });
      },
    }),
    {
      name: 'war-room-store',
      partialize: (s) => ({
        provider: s.provider,
        apiKey: s.apiKey,
        baseUrl: s.baseUrl,
        model: s.model,
        selectedVoice: s.selectedVoice,
        selectedScenario: s.selectedScenario,
        sessionHistory: s.sessionHistory,
        knowledgeMeta: s.knowledgeMeta,
      }),
    }
  )
);
