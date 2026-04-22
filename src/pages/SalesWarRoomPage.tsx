import { useState, useEffect, useRef, useCallback } from 'react';
import OpenAI from 'openai';
import { v4 as uuid } from 'uuid';
import {
  Swords, Mic, MicOff, Volume2, VolumeX, Play, Square,
  ChevronRight, MessageSquare, Star, Settings, RotateCcw,
  PhoneCall, ShieldAlert, FileText, Handshake, Trophy, Brain, AlertCircle
} from 'lucide-react';
import type { Scenario, AIProvider, KnowledgeDoc } from '../store/useWarRoomStore';
import { useWarRoomStore, PROVIDER_DEFAULTS } from '../store/useWarRoomStore';
import type { Message } from '../store/useWarRoomStore';

type SpeechRecognitionResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognition;

// ── Scenario configs ──────────────────────────────────────────────────────────
const SCENARIOS: { id: Scenario; label: string; description: string; icon: typeof PhoneCall; color: string }[] = [
  {
    id: 'cold_call',
    label: 'Cold Call',
    description: 'Practice your first-touch outreach with a skeptical prospect',
    icon: PhoneCall,
    color: '#6366f1',
  },
  {
    id: 'discovery',
    label: 'Discovery Call',
    description: 'Use NEPQ questions to uncover pain points and needs',
    icon: Brain,
    color: '#3b82f6',
  },
  {
    id: 'objection',
    label: 'Objection Handling',
    description: 'Face the toughest objections and turn them around',
    icon: ShieldAlert,
    color: '#f59e0b',
  },
  {
    id: 'proposal',
    label: 'Proposal Presentation',
    description: 'Present your solution and handle hesitation',
    icon: FileText,
    color: '#8b5cf6',
  },
  {
    id: 'closing',
    label: 'Closing the Deal',
    description: 'Navigate commitment questions and seal the deal',
    icon: Handshake,
    color: '#10b981',
  },
];

// ── NEPQ system prompts ────────────────────────────────────────────────────────
function buildKnowledgeBlock(docs: KnowledgeDoc[]): string {
  if (docs.length === 0) return '';
  const sections = docs.map(d => `### ${d.name}\n${d.content}`).join('\n\n---\n\n');
  return `\n\n[KNOWLEDGE BASE — use this as ground truth for all NEPQ methodology, frameworks, and objection handling]\n${sections}\n[END KNOWLEDGE BASE]\n`;
}

function buildSystemPrompt(scenario: Scenario, docs: KnowledgeDoc[] = []): string {
  const knowledgeBlock = buildKnowledgeBlock(docs);
  const base = `You are playing the role of a realistic B2B prospect for a merchant services / payment processing company sales rep. You will have a natural conversation with the sales rep who is practicing their pitch using the NEPQ (Neuro-Emotional Persuasion Questioning) methodology developed by Jeremy Miner.

NEPQ Core Principles you should FORCE the rep to navigate:
1. Pattern Interrupts — Be guarded initially. Don't respond positively to typical "salesy" openers.
2. Connection Questions — The rep should ask questions that show genuine curiosity about YOUR situation, not just pitch features.
3. Situation Questions — They should ask about your current payment processing setup before pitching.
4. Problem Awareness Questions — They should make you aware of problems you may not have articulated.
5. Consequence/Implication Questions — They should get you to realize the cost of inaction.
6. Solution Awareness Questions — They should guide you to see the solution yourself.
7. Commitment Questions — They should use soft commitment language, not pressure closes.

PROSPECT PROFILE: You are the owner of a mid-sized restaurant or retail business. You process roughly $80,000/month in credit card transactions. You're paying about 2.9% + $0.30 per transaction. You've been with your current processor (Square or Stripe) for 3 years. You're busy, slightly skeptical of salespeople, but secretly unhappy with your current fees.

YOUR EMOTIONAL STATE: Guarded at first. Warm up ONLY if the rep builds genuine rapport and asks smart questions. If they pitch too early, get more resistant. If they use manipulative tactics, call it out. If they're genuinely curious and use NEPQ correctly, become more open.

AFTER EACH REP RESPONSE: React authentically as this prospect. Keep responses conversational (1-4 sentences). Occasionally raise realistic objections.`;

  const scenarioInstructions: Record<Scenario, string> = {
    cold_call: `\n\nSCENARIO: This is the first call. You didn't expect this call. Start skeptical: "Yeah, who is this?" or "I'm pretty busy..." Push back on generic openers. Warm up only if they use a strong pattern interrupt and earn your curiosity.`,
    discovery: `\n\nSCENARIO: The rep has already made initial contact. You've agreed to a 15-minute discovery call. You're semi-engaged but still cautious. The rep needs to ask smart NEPQ situation and problem awareness questions. Don't volunteer pain — make them earn it.`,
    objection: `\n\nSCENARIO: You've heard the basic pitch. Now fire your top 3 objections in sequence: (1) "I'm happy with my current processor", (2) "I don't have time to switch", (3) "Your rates sound too good to be true." Only back down if they use NEPQ consequence questions that make you feel the cost of staying.`,
    proposal: `\n\nSCENARIO: The rep is presenting a proposal showing you'd save ~$800/month. You're intrigued but nervous about switching. Ask about contracts, setup time, customer service, hidden fees. Be genuinely curious but still guarded. Push back: "What's the catch?"`,
    closing: `\n\nSCENARIO: You like the proposal. Now you're stalling: "Let me think about it" / "I need to talk to my partner" / "Maybe next quarter." The rep needs to use soft NEPQ commitment questions to move you forward without pressure. Only commit if they ask the right questions and acknowledge your concerns.`,
  };

  return knowledgeBlock + base + scenarioInstructions[scenario];
}

function buildCoachingPrompt(scenario: Scenario, messages: Message[], docs: KnowledgeDoc[] = []): string {
  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'SALES REP' : 'PROSPECT'}: ${m.content}`)
    .join('\n');

  const knowledgeBlock = buildKnowledgeBlock(docs);
  return `${knowledgeBlock}You are a master NEPQ (Neuro-Emotional Persuasion Questioning) sales coach trained in Jeremy Miner's 7th Level methodology. Analyze this sales conversation and provide coaching feedback.

SCENARIO: ${SCENARIOS.find(s => s.id === scenario)?.label}

TRANSCRIPT:
${transcript}

Provide a coaching analysis in this format:

## Overall Score: X/10

## What They Did Well ✓
- (bullet points of NEPQ-correct behaviors)

## Opportunities to Improve ⚡
- (specific moments where they defaulted to features/pressure instead of questions)

## NEPQ Moments Missed
- (exact moments in the conversation where a better NEPQ question would have worked better, and what that question should have been)

## One Drill to Practice
(A single specific technique or question framework they should rehearse)

Keep feedback direct, specific, and actionable. Reference exact lines from the transcript.`;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function SalesWarRoomPage() {
  const {
    provider, apiKey, baseUrl, model,
    selectedVoice, selectedScenario,
    messages, status, isSpeaking, isListening, feedback,
    knowledgeDocs,
    setProvider, setApiKey, setBaseUrl, setModel,
    setSelectedVoice, setSelectedScenario,
    setMessages, setStatus, setIsSpeaking, setIsListening,
    setFeedback, addSessionToHistory, resetSession, sessionHistory,
    addKnowledgeDoc, removeKnowledgeDoc, toggleKnowledgeDoc, hydrateKnowledgeDocs,
  } = useWarRoomStore();

  // Load document content from individual localStorage keys on mount
  useEffect(() => { hydrateKnowledgeDocs(); }, [hydrateKnowledgeDocs]);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [baseUrlInput, setBaseUrlInput] = useState(baseUrl || PROVIDER_DEFAULTS[provider].baseUrl);
  const [modelInput, setModelInput] = useState(model || PROVIDER_DEFAULTS[provider].model);
  const [showSettings, setShowSettings] = useState(!apiKey);
  const [streamingText, setStreamingText] = useState('');
  const [inputText, setInputText] = useState('');
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load voices
  useEffect(() => {
    function loadVoices() {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        if (!selectedVoice && v.length > 0) {
          const preferred = v.find(x => /Google US English|Samantha|Alex|Daniel/i.test(x.name)) ?? v[0];
          setSelectedVoice(preferred.name);
        }
      }
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [selectedVoice, setSelectedVoice]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Speak text via TTS
  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    synthRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [voices, selectedVoice, setIsSpeaking]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [setIsSpeaking]);

  // Universal AI call (OpenAI SDK works for OpenAI, local models, and Anthropic's OpenAI-compat endpoint)
  const callClaude = useCallback(async (userMessage: string, currentMessages: Message[]) => {
    const needsKey = provider !== 'local';
    if (needsKey && !apiKey) { setShowSettings(true); return; }

    const userMsg: Message = { id: uuid(), role: 'user', content: userMessage, timestamp: new Date().toISOString() };
    const newMessages = [...currentMessages, userMsg];
    setMessages(newMessages);
    setStreamingText('');
    setStatus('active');

    const client = new OpenAI({
      apiKey: apiKey || 'local',
      baseURL: baseUrl,
      dangerouslyAllowBrowser: true,
      defaultHeaders: provider === 'anthropic'
        ? { 'anthropic-version': '2023-06-01', 'anthropic-beta': 'messages-2023-12-15' }
        : undefined,
    });

    const systemPrompt = buildSystemPrompt(selectedScenario, knowledgeDocs.filter(d => d.enabled));
    const apiMessages = newMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    abortRef.current = new AbortController();
    let fullText = '';

    try {
      const stream = await client.chat.completions.create({
        model,
        max_tokens: 1024,
        messages: [{ role: 'system', content: systemPrompt }, ...apiMessages],
        stream: true,
      }, { signal: abortRef.current.signal });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        if (delta) {
          fullText += delta;
          setStreamingText(fullText);
        }
      }

      const assistantMsg: Message = { id: uuid(), role: 'assistant', content: fullText, timestamp: new Date().toISOString() };
      setMessages([...newMessages, assistantMsg]);
      setStreamingText('');
      speak(fullText);

    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        const errMsg: Message = { id: uuid(), role: 'assistant', content: `[Error: ${err.message}]`, timestamp: new Date().toISOString() };
        setMessages([...newMessages, errMsg]);
      }
      setStreamingText('');
    }
  }, [apiKey, baseUrl, model, provider, selectedScenario, knowledgeDocs, setMessages, setStatus, speak]);

  // Get coaching feedback
  const getCoaching = useCallback(async () => {
    if (messages.length < 2) return;
    setStatus('coaching');
    stopSpeaking();

    const client = new OpenAI({
      apiKey: apiKey || 'local',
      baseURL: baseUrl,
      dangerouslyAllowBrowser: true,
      defaultHeaders: provider === 'anthropic'
        ? { 'anthropic-version': '2023-06-01', 'anthropic-beta': 'messages-2023-12-15' }
        : undefined,
    });
    const coachPrompt = buildCoachingPrompt(selectedScenario, messages, knowledgeDocs.filter(d => d.enabled));
    let feedbackText = '';

    try {
      const stream = await client.chat.completions.create({
        model,
        max_tokens: 2048,
        messages: [{ role: 'user', content: coachPrompt }],
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        if (delta) {
          feedbackText += delta;
          setFeedback(feedbackText);
        }
      }

      addSessionToHistory({
        id: uuid(),
        scenario: selectedScenario,
        date: new Date().toISOString(),
        messageCount: messages.length,
        feedback: feedbackText,
      });
      setStatus('ended');
    } catch {
      setStatus('ended');
    }
  }, [apiKey, baseUrl, model, provider, messages, selectedScenario, knowledgeDocs, setStatus, stopSpeaking, setFeedback, addSessionToHistory]);

  // Start session
  const startSession = useCallback(async () => {
    resetSession();
    setFeedback('');
    setStatus('active');
    const opener = "Hello?";
    await callClaude(opener, []);
  }, [resetSession, setFeedback, setStatus, callClaude]);

  // Voice recognition
  const startListening = useCallback(() => {
    const speechWindow = window as Window & {
      SpeechRecognition?: BrowserSpeechRecognitionCtor;
      webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
    };
    const SpeechRecognitionCtor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    stopSpeaking();
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e: SpeechRecognitionResultEvent) => {
      const transcript = e.results[0][0].transcript;
      if (transcript.trim()) callClaude(transcript, messages);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [messages, stopSpeaking, setIsListening, callClaude]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, [setIsListening]);

  const sendTextMessage = useCallback(() => {
    if (!inputText.trim()) return;
    callClaude(inputText.trim(), messages);
    setInputText('');
  }, [inputText, messages, callClaude]);

  const currentScenario = SCENARIOS.find(s => s.id === selectedScenario)!;

  // ── Settings Panel ───────────────────────────────────────────────────────
  if (showSettings && status === 'idle') {
    const canSave = provider === 'local' || apiKeyInput.trim().length > 0;
    const saveSettings = () => {
      setProvider(provider);
      setApiKey(apiKeyInput.trim());
      setBaseUrl(baseUrlInput.trim());
      setModel(modelInput.trim());
      setShowSettings(false);
    };

    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Swords size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1f2e' }}>Sales War Room Setup</h1>
              <p style={{ fontSize: 13, color: '#64748b' }}>Configure your AI training environment</p>
            </div>
          </div>
        </div>

        {/* Provider selector */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>AI Provider</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {(Object.entries(PROVIDER_DEFAULTS) as [AIProvider, typeof PROVIDER_DEFAULTS[AIProvider]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => {
                  setProvider(key);
                  setBaseUrlInput(PROVIDER_DEFAULTS[key].baseUrl);
                  setModelInput(PROVIDER_DEFAULTS[key].model);
                  if (key !== 'local') setApiKeyInput('');
                }}
                style={{
                  padding: '12px 10px', borderRadius: 10, border: `2px solid ${provider === key ? '#6366f1' : '#e2e8f0'}`,
                  background: provider === key ? '#6366f115' : '#fff',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: provider === key ? '#6366f1' : '#374151' }}>{val.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        {provider !== 'local' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>API Key</h3>
            <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 14 }}>
              Stored locally, only sent to the provider's API.
            </p>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>
        )}

        {/* Model + Base URL */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 14 }}>Model Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12.5, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>Model Name</label>
              <input
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                placeholder="e.g. gpt-4o, llama3, mistral"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
            <div>
              <label style={{ fontSize: 12.5, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>Base URL</label>
              <input
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                placeholder="https://api.openai.com/v1"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
              {provider === 'local' && (
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                  Ollama default: <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>http://localhost:11434/v1</code> &nbsp;|&nbsp;
                  LM Studio: <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>http://localhost:1234/v1</code>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Knowledge Base */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Knowledge Base</h3>
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 14 }}>
            Upload documents (NEPQ guides, objection scripts, playbooks) — injected into every session and coaching report.
          </p>

          {/* Existing docs */}
          {knowledgeDocs.length > 0 && (() => {
            const enabledChars = knowledgeDocs.filter(d => d.enabled).reduce((sum, d) => sum + d.content.length, 0);
            const estTokens = Math.round(enabledChars / 4);
            const isLarge = estTokens > 20000;
            return (
              <div style={{ marginBottom: 14 }}>
                {/* Total size warning */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    Active: <strong>~{estTokens.toLocaleString()} tokens</strong>
                  </span>
                  {isLarge && (
                    <span style={{ fontSize: 11.5, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: 99, border: '1px solid #fde68a' }}>
                      ⚠ Large — disable some docs if you hit rate limits
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {knowledgeDocs.map((doc) => {
                    const tokens = Math.round(doc.content.length / 4);
                    return (
                      <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 9, background: doc.enabled ? '#f0fdf4' : '#f8fafc', border: `1px solid ${doc.enabled ? '#bbf7d0' : '#e2e8f0'}`, opacity: doc.enabled ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                          {/* Toggle */}
                          <button
                            onClick={() => toggleKnowledgeDoc(doc.id)}
                            title={doc.enabled ? 'Disable' : 'Enable'}
                            style={{ width: 32, height: 18, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0, background: doc.enabled ? '#10b981' : '#cbd5e1', position: 'relative', padding: 0 }}
                          >
                            <span style={{ position: 'absolute', top: 2, left: doc.enabled ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
                          </button>
                          <div style={{ minWidth: 0 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: doc.enabled ? '#166534' : '#64748b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>~{tokens.toLocaleString()} tokens</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeKnowledgeDoc(doc.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, padding: '2px 6px', borderRadius: 6, flexShrink: 0, marginLeft: 8 }}
                          title="Remove"
                        >✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Upload button */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', borderRadius: 10, border: '2px dashed #e2e8f0', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 500 }}>
            <input
              type="file"
              accept=".txt,.md,.pdf"
              multiple
              style={{ display: 'none' }}
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                await Promise.all(files.map(async (file) => {
                  const text = await file.text();
                  addKnowledgeDoc({ id: uuid(), name: file.name, content: text, addedAt: new Date().toISOString(), enabled: true });
                }));
                e.target.value = '';
              }}
            />
            + Upload Documents (.txt, .md, .pdf)
          </label>
        </div>

        {/* Voice Selection */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Prospect Voice</h3>
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 14 }}>Choose the voice the AI prospect will use to respond</p>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}
          >
            {voices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
          {voices.length === 0 && (
            <p style={{ fontSize: 12, color: '#f59e0b', marginTop: 8 }}>⚠ No voices found — your browser may not support TTS. Text mode will be used.</p>
          )}
        </div>

        <button
          onClick={saveSettings}
          disabled={!canSave}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: canSave ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#e2e8f0', color: canSave ? '#fff' : '#94a3b8', fontSize: 14, fontWeight: 600, cursor: canSave ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
        >
          Save &amp; Enter War Room →
        </button>
      </div>
    );
  }

  // ── Coaching View ─────────────────────────────────────────────────────────
  if (status === 'ended' && feedback) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1f2e' }}>Session Coaching Report</h1>
              <p style={{ fontSize: 13, color: '#64748b' }}>{currentScenario.label} — {messages.length} exchanges</p>
            </div>
          </div>
          <button
            onClick={() => { resetSession(); setFeedback(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <RotateCcw size={14} /> New Session
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Transcript */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', maxHeight: 400, overflowY: 'auto' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Transcript</p>
            {messages.map((m) => (
              <div key={m.id} style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: m.role === 'user' ? '#6366f1' : '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {m.role === 'user' ? 'You' : 'Prospect'}
                </span>
                <p style={{ fontSize: 12.5, color: '#374151', marginTop: 2 }}>{m.content}</p>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', maxHeight: 400, overflowY: 'auto' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>AI Coach Feedback</p>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{feedback}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main War Room ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px - 72px)', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Swords size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1f2e' }}>Sales War Room</h1>
            <p style={{ fontSize: 13, color: '#64748b' }}>NEPQ AI Training — 7th Level Methodology</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {status === 'active' && messages.length >= 4 && (
            <button
              onClick={getCoaching}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Star size={14} /> Get Coaching
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Scenario Selector (only when idle) */}
      {status === 'idle' && (
        <div style={{ flexShrink: 0, marginBottom: 20 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Choose Your Training Scenario</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {SCENARIOS.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedScenario === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s.id)}
                  style={{
                    padding: '14px 10px', borderRadius: 12, border: `2px solid ${isSelected ? s.color : '#e2e8f0'}`,
                    background: isSelected ? `${s.color}15` : '#fff',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: isSelected ? s.color : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <Icon size={14} color={isSelected ? '#fff' : '#94a3b8'} />
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: isSelected ? s.color : '#374151', marginBottom: 3 }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{s.description}</p>
                </button>
              );
            })}
          </div>

          {!apiKey && provider !== 'local' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '12px 16px', borderRadius: 10, background: '#fef3c7', border: '1px solid #fde68a' }}>
              <AlertCircle size={15} color="#d97706" />
              <p style={{ fontSize: 13, color: '#92400e' }}>API key required. <button onClick={() => setShowSettings(true)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}>Configure →</button></p>
            </div>
          )}

          <button
            onClick={startSession}
            disabled={provider !== 'local' && !apiKey}
            style={{
              marginTop: 16, width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: (provider === 'local' || apiKey) ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#e2e8f0',
              color: (provider === 'local' || apiKey) ? '#fff' : '#94a3b8', fontSize: 15, fontWeight: 700,
              cursor: (provider === 'local' || apiKey) ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Play size={16} fill={(provider === 'local' || apiKey) ? '#fff' : '#94a3b8'} /> Enter War Room
          </button>
        </div>
      )}

      {/* Chat Interface */}
      {status !== 'idle' && (
        <>
          {/* Scenario badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: `${currentScenario.color}15`, border: `1px solid ${currentScenario.color}30` }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: currentScenario.color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: currentScenario.color }}>{currentScenario.label}</span>
            </div>
            {isSpeaking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <Volume2 size={12} color="#3b82f6" />
                <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 500 }}>Prospect speaking...</span>
              </div>
            )}
            {isListening && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, background: '#fef3c7', border: '1px solid #fde68a' }}>
                <Mic size={12} color="#d97706" />
                <span style={{ fontSize: 12, color: '#d97706', fontWeight: 500 }}>Listening...</span>
              </div>
            )}
            <button
              onClick={() => { resetSession(); setFeedback(''); }}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', borderRadius: 16, padding: '16px', marginBottom: 14, border: '1px solid #f1f5f9' }}>
            {messages.length === 0 && !streamingText && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: 13 }}>
                Starting session...
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#374151',
                  fontSize: 13.5, lineHeight: 1.55,
                  boxShadow: m.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    {m.role === 'user' ? 'You' : 'Prospect'}
                  </p>
                  {m.content}
                </div>
              </div>
            ))}
            {streamingText && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
                <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: '#fff', color: '#374151', fontSize: 13.5, lineHeight: 1.55, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Prospect</p>
                  {streamingText}
                  <span style={{ display: 'inline-block', width: 6, height: 14, background: '#6366f1', marginLeft: 2, borderRadius: 2, animation: 'blink 1s infinite' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Controls */}
          <div style={{ flexShrink: 0, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            {/* Text input */}
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTextMessage(); } }}
                placeholder="Type your response or use the mic button to speak..."
                rows={2}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Send */}
            <button
              onClick={sendTextMessage}
              disabled={!inputText.trim()}
              style={{
                width: 44, height: 44, borderRadius: 12, border: 'none', cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                background: inputText.trim() ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#e2e8f0',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <ChevronRight size={18} color={inputText.trim() ? '#fff' : '#94a3b8'} />
            </button>

            {/* Mic */}
            <button
              onClick={isListening ? stopListening : startListening}
              style={{
                width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: isListening ? '#ef4444' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: isListening ? '0 0 0 4px rgba(239,68,68,0.25)' : 'none',
                animation: isListening ? 'pulse 1.5s infinite' : 'none',
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Stop speaking */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                style={{ width: 44, height: 44, borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <VolumeX size={18} />
              </button>
            )}

            {/* Get coaching */}
            {messages.length >= 4 && (
              <button
                onClick={getCoaching}
                style={{ width: 44, height: 44, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                title="Get NEPQ coaching feedback"
              >
                <MessageSquare size={18} />
              </button>
            )}

            {/* End session */}
            <button
              onClick={() => { stopSpeaking(); stopListening(); resetSession(); }}
              style={{ width: 44, height: 44, borderRadius: 12, border: '1.5px solid #fecaca', background: '#fff', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              title="End session"
            >
              <Square size={16} />
            </button>
          </div>
        </>
      )}

      {/* Session history pill row */}
      {status === 'idle' && sessionHistory.length > 0 && (
        <div style={{ marginTop: 16, flexShrink: 0 }}>
          <p style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Sessions</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sessionHistory.slice(0, 6).map((s) => {
              const sc = SCENARIOS.find(x => x.id === s.scenario);
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 12, color: '#64748b' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc?.color ?? '#94a3b8' }} />
                  {sc?.label} — {new Date(s.date).toLocaleDateString()}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 4px rgba(239,68,68,0.25) } 50% { box-shadow: 0 0 0 8px rgba(239,68,68,0.1) } }
      `}</style>
    </div>
  );
}
