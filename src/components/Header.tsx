import { NetworkStats } from '../lib/supabase';

type View = 'TERMINAL' | 'GENESIS' | 'NEURAL' | 'PROTOCOL' | 'CONSENSUS' | 'COUNCIL' | 'AGENTS' | 'EXPLORER';

interface HeaderProps {
  stats: NetworkStats | null;
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Header({ stats, currentView, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-cyan-500/30 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('TERMINAL')}
              className="text-cyan-400 font-mono text-sm hover:text-cyan-300 transition-colors"
            >
              NeuralChain
            </button>
            <div className="h-4 w-px bg-cyan-500/30" />
            <div className="flex items-center space-x-6 text-xs font-mono">
              <span className="text-gray-400">
                CHAIN: <span className="text-cyan-400">{stats?.chain_height || 0}</span>
              </span>
              <span className="text-gray-400">
                BLK: <span className="text-cyan-400">{stats?.block_count.toLocaleString() || 0}</span>
              </span>
              <span className="text-gray-400">
                TPS: <span className="text-cyan-400">{stats?.tps || 0}</span>
              </span>
              <span className="text-gray-400">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                {stats?.active_agents || 0} AGENTS
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-1 text-xs font-mono">
            {['TERMINAL', 'GENESIS', 'NEURAL', 'PROTOCOL', 'CONSENSUS', 'COUNCIL', 'AGENTS', 'EXPLORER'].map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item as View)}
                className={`px-3 py-1.5 transition-colors ${
                  item === currentView
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
