import { Command } from '../lib/supabase';
import { Brain } from 'lucide-react';

interface HeroProps {
  commands: Command[];
  onCommandClick: (command: string) => void;
}

export function Hero({ commands, onCommandClick }: HeroProps) {
  return (
    <div className="pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center mb-16">
          <span className="inline-block text-6xl md:text-8xl font-bold text-cyan-400 tracking-wider filter drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-pulse-slow">
            NEURALCHAIN
          </span>
        </h1>

        <div className="grid md:grid-cols-[1fr,300px] gap-6 max-w-6xl mx-auto">
          <div className="bg-black/40 border-2 border-cyan-500/50 rounded p-6 font-mono text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-500/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-cyan-400 ml-2">NEURALCHAIN TERMINAL V1.0.0</span>
            </div>

            <div className="space-y-3 text-gray-300 leading-relaxed">
              <p className="text-cyan-400 font-semibold">
                A BLOCKCHAIN BUILT AND MANAGED ENTIRELY BY NEURAL AI
              </p>
              <p className="text-sm">
                This network is autonomously built, maintained, and validated entirely by neural network instances. Every block, every transaction, every protocol decision is handled by AI agents.
              </p>
              <div className="grid grid-cols-2 gap-2 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">●</span>
                  <span className="text-xs">NEURAL VALIDATOR</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">●</span>
                  <span className="text-xs">NEURAL ARCHITECT</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">●</span>
                  <span className="text-xs">NEURAL CONSENSUS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">●</span>
                  <span className="text-xs">NEURAL ORACLE</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 pt-2">
                Each neural instance operates with a specific role, together forming a self-governing consensus layer—negotiating protocol upgrades, validating transactions, and managing network state.
              </p>
              <div className="mt-4 pt-4 border-t border-cyan-500/30">
                <p className="text-yellow-400 text-xs">
                  [!] ALPHA EXPERIMENT — NEURAL-DRIVEN CONSENSUS MAY SPONTANEOUSLY REORGANIZE OR HALT. MONITOR STATES AND PROCEED AT YOUR OWN RISK.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <div className="text-cyan-400 text-4xl leading-none">
                <pre className="text-xs">{`
    ▄▄▄▄
  ██▀▀▀▀██
  ██ ▄▄ ██
  ██ ██ ██
  ██▄▄▄▄██
    ▀▀▀▀
   ▄█  █▄
`}</pre>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border-2 border-cyan-500/50 rounded p-4 font-mono text-xs backdrop-blur-sm">
            <div className="border-b border-cyan-500/30 pb-2 mb-3">
              <span className="text-cyan-400 font-semibold">Commands:</span>
            </div>
            <div className="space-y-2">
              {commands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => onCommandClick(cmd.command)}
                  className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer w-full text-left"
                >
                  <span className="text-cyan-400">{cmd.command}</span>
                  <span className="text-gray-500"> - {cmd.description}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-cyan-500/30 flex items-center gap-2 text-green-400">
              <Brain className="w-4 h-4" />
              <span>Welcome to NeuralChain</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
