import { useState } from 'react';
import { Send } from 'lucide-react';

interface CommandInputProps {
  onSubmit: (command: string) => void;
}

export function CommandInput({ onSubmit }: CommandInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-sm flex-shrink-0">&gt;</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Neural AI or type a command..."
              className="flex-1 bg-transparent border border-cyan-500/30 rounded px-4 py-2 text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-sm rounded transition-colors flex items-center gap-2"
            >
              Send
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <div className="mt-2 text-xs font-mono text-gray-600 text-center">
          Press Enter to send • Arrow keys for history • Type /help for commands
        </div>
      </div>
    </div>
  );
}
