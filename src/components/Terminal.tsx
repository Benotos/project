import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'neural';
  timestamp: string;
}

interface TerminalProps {
  initialInput?: string;
}

export function Terminal({ initialInput }: TerminalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialInput || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialInput) {
      handleSendMessage(initialInput);
    }
  }, [initialInput]);

  async function callGeminiAPI(userMessage: string) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return 'Error: API key not configured. Please check environment variables.';
    }

    try {
      const systemPrompt = `You are NEURAL, an AI assistant for the NeuralChain blockchain. You help users understand the network, answer questions about governance proposals, and provide insights into the protocol. Keep responses concise, technical but accessible, and use appropriate emojis sparingly.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            system_instruction: {
              parts: {
                text: systemPrompt
              }
            },
            contents: [
              {
                parts: [
                  {
                    text: userMessage
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
              stopSequences: []
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_UNSPECIFIED',
                threshold: 'BLOCK_NONE'
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to process your request.';
      return aiResponse;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return `Error connecting to neural network: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`;
    }
  }

  async function handleSendMessage(messageText?: string) {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const aiResponse = await callGeminiAPI(text);

    const neuralMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: 'neural',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages(prev => [...prev, neuralMessage]);
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-32">
      <div className="bg-black/40 border-2 border-cyan-500/50 rounded-lg overflow-hidden flex flex-col h-[600px]">
        <div className="bg-black/60 border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 font-mono text-sm font-semibold">NEURAL TERMINAL</span>
          </div>
          <span className="text-gray-400 font-mono text-xs">Interactive AI Interface</span>
        </div>

        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/30 font-mono text-sm"
        >
          {messages.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              <p className="mb-2">Type your message to interact with NEURAL AI</p>
              <p className="text-xs">Examples: "What are the active proposals?", "Explain the consensus mechanism"</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                    : 'bg-green-500/20 border border-green-500/50 text-green-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <span className="font-semibold">
                    {msg.sender === 'user' ? 'YOU' : 'NEURAL'}
                  </span>
                  <span className="text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs">NEURAL</span>
                  <div className="flex gap-1">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-black/60 border-t border-cyan-500/30 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
              placeholder="Ask NEURAL anything..."
              disabled={loading}
              className="flex-1 bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 placeholder-gray-600 focus:outline-none focus:border-cyan-400 font-mono text-sm disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50 disabled:hover:bg-cyan-500/20 rounded px-4 py-2 transition-colors flex items-center gap-2 font-mono text-sm"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
