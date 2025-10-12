import React, { useState, useEffect, useRef } from 'react';
import type { Agent } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from "@google/genai";

interface ConverseModalProps {
  agent: Agent;
  onClose: () => void;
}

// Audio helper functions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


const ConverseModal: React.FC<ConverseModalProps> = ({ agent, onClose }) => {
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'ERROR'>('IDLE');
  const [transcription, setTranscription] = useState<{ speaker: 'user' | 'agent', text: string }[]>([]);
  
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTimeRef = useRef(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');
  
  const stopConversation = () => {
     if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
     }
     if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
     }
     if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
     }
     if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close();
     }
     if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close();
     }
     sourcesRef.current.forEach(source => source.stop());
     sourcesRef.current.clear();
     setStatus('IDLE');
  };

  const handleClose = () => {
    stopConversation();
    onClose();
  };

  useEffect(() => {
    const startConversation = async () => {
      setStatus('CONNECTING');
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const directive = agent.personality.distilledDirective || agent.personality.basePrompt;
        
        // Setup audio contexts
        // FIX: Cast `window` to `any` to allow access to the vendor-prefixed `webkitAudioContext` for older browser compatibility.
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = outputAudioContextRef.current.createGain();

        sessionPromiseRef.current = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setStatus('LISTENING');
              const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
              scriptProcessorRef.current = scriptProcessor;
              
              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                if (sessionPromiseRef.current) {
                  sessionPromiseRef.current.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                  });
                }
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContextRef.current!.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              // Transcription
              if (message.serverContent?.outputTranscription) {
                currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
              }
              if (message.serverContent?.inputTranscription) {
                currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
              }
              if (message.serverContent?.turnComplete) {
                setTranscription(prev => [
                  ...prev,
                  { speaker: 'user', text: currentInputTranscriptionRef.current },
                  { speaker: 'agent', text: currentOutputTranscriptionRef.current },
                ]);
                currentInputTranscriptionRef.current = '';
                currentOutputTranscriptionRef.current = '';
              }

              // Audio
              const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
              if (base64EncodedAudioString) {
                setStatus('SPEAKING');
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime);
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  outputAudioContextRef.current!,
                  24000, 1
                );
                const source = outputAudioContextRef.current!.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) {
                      setStatus('LISTENING');
                  }
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e: ErrorEvent) => {
              console.error('Session error:', e);
              setStatus('ERROR');
            },
            onclose: (e: CloseEvent) => {
              stopConversation();
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: `You are the AI agent known as ${agent.name}. Your core directive is: "${directive}". Interact naturally based on this persona.`,
          },
        });
      } catch (error) {
        console.error("Failed to start conversation:", error);
        setStatus('ERROR');
      }
    };

    startConversation();

    return () => {
      stopConversation();
    };
  }, [agent]); // Re-run effect if agent changes

  const getStatusIndicator = () => {
      switch (status) {
          case 'CONNECTING': return <div className="text-yellow-400">Connecting...</div>;
          case 'LISTENING': return <div className="text-green-400 animate-pulse">Listening...</div>;
          case 'SPEAKING': return <div className="text-blue-400">Speaking...</div>;
          case 'ERROR': return <div className="text-red-500">Connection Error</div>;
          default: return <div className="text-gray-400">Idle</div>;
      }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-purple-500/30 rounded-lg shadow-2xl w-full max-w-2xl h-[70vh] flex flex-col">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Converse with {agent.name}
            </h2>
            <div className="text-sm font-semibold">{getStatusIndicator()}</div>
          </div>
          <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full border-2 border-purple-500/50" />
        </header>
        <main className="p-6 overflow-y-auto flex-grow bg-gray-900/50">
           <div className="space-y-4 text-sm font-mono">
                {transcription.map((line, index) => (
                    <div key={index} className={line.speaker === 'user' ? 'text-gray-400' : 'text-purple-300'}>
                        <span className="font-bold">{line.speaker === 'user' ? 'You: ' : `${agent.name}: `}</span>
                        {line.text}
                    </div>
                ))}
           </div>
        </main>
        <footer className="p-4 border-t border-gray-700 flex justify-end">
          <button onClick={handleClose} className="px-4 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-700">End Conversation</button>
        </footer>
      </div>
    </div>
  );
};

export default ConverseModal;