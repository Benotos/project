import { Background3D } from './components/Background3D';
import { useEffect, useState, useRef } from 'react';
import { supabase, NetworkStats, Proposal, Command } from './lib/supabase';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProposalCard } from './components/ProposalCard';
import { CommandInput } from './components/CommandInput';
import { LiveCouncil } from './components/LiveCouncil';
import { Terminal } from './components/Terminal';

type View = 'TERMINAL' | 'GENESIS' | 'NEURAL' | 'PROTOCOL' | 'CONSENSUS' | 'AGENTS' | 'EXPLORER' | 'COUNCIL' | 'AI_TERMINAL';

function App() {
  // Cache States
  const [stats, setStats] = useState<NetworkStats | null>(() => {
    const saved = localStorage.getItem('nc_stats');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentView, setCurrentView] = useState<View>(() => {
    const saved = localStorage.getItem('nc_view');
    return (saved as View) || 'TERMINAL';
  });

  const [messages, setMessages] = useState<Array<{ type: 'user' | 'system'; text: string }>>(() => {
    const saved = localStorage.getItem('nc_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  
  // NEW: Live UTC Time State
  const [currentTime, setCurrentTime] = useState<string>('');
  const proposalsRef = useRef<HTMLDivElement>(null);

  // Save to Cache on Update
  useEffect(() => {
    if (stats) localStorage.setItem('nc_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('nc_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('nc_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    loadData();
  }, []);

  // Live Blockchain & Real-Time UTC Simulation
  useEffect(() => {
    // 1. Live Block Height and TPS updates (Every 3.2 seconds)
    const blockInterval = setInterval(() => {
      setStats(prevStats => {
        if (!prevStats) return prevStats;
        const tpsFluctuation = Math.floor(Math.random() * 21) - 10; 
        const newTps = Math.max(3226, prevStats.tps + tpsFluctuation);

        return {
          ...prevStats,
          chain_height: prevStats.chain_height + 1,
          block_count: prevStats.block_count + 1,
          tps: newTps
        };
      });
    }, 3200); 

    // 2. NEW: Real-Time World UTC Clock (Updates every second)
    const timeInterval = setInterval(() => {
      const now = new Date();
      // Formats the output to strictly look like "2026-03-06 14:30:05 UTC"
      const formattedUTC = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setCurrentTime(formattedUTC);
    }, 1000);

    // Initial time set so it doesn't wait 1 second to appear
    setCurrentTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');

    return () => {
      clearInterval(blockInterval);
      clearInterval(timeInterval);
    };
  }, []);

  async function loadData() {
    if (!localStorage.getItem('nc_stats')) {
      const { data: statsData } = await supabase
        .from('network_stats')
        .select('*')
        .maybeSingle();
      if (statsData) setStats(statsData);
    }

    const { data: proposalsData } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: commandsData } = await supabase
      .from('commands')
      .select('*')
      .order('command', { ascending: true });

    if (proposalsData) setProposals(proposalsData);
    if (commandsData) setCommands(commandsData);
  }

  function handleNavigation(view: View) {
    setCurrentView(view);
    if (view === 'PROTOCOL') {
      setTimeout(() => {
        proposalsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleCommand(input: string) {
    setMessages(prev => [...prev, { type: 'user', text: input }]);

    const cmd = input.toLowerCase().trim();
    const args = cmd.split(' ');
    const baseCmd = args[0];
    let response = '';

    if (baseCmd === '/genesis' || baseCmd === 'genesis') {
      response = 'GENESIS OVERVIEW: NeuralChain initialized at block 0. Total supply: 1B NEURAL tokens. Consensus: Neural Proof-of-Intelligence (NPoI).';
      setCurrentView('GENESIS');
    } else if (baseCmd === '/neural' || baseCmd === 'neural') {
      response = 'NEURAL AI: Hello! I am the primary neural network instance managing NeuralChain. How can I assist you today?';
      setCurrentView('NEURAL');
    } else if (baseCmd === '/protocol' || baseCmd === 'protocol') {
      response = 'Loading NIPs (NeuralChain Improvement Proposals)...';
      setCurrentView('PROTOCOL');
      setTimeout(() => {
        proposalsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (baseCmd === '/consensus' || baseCmd === 'consensus') {
      response = 'CONSENSUS STATUS: Active validators: 12 | Current epoch: 847 | Consensus participation: 98.7%';
      setCurrentView('CONSENSUS');
    } else if (baseCmd === '/status' || baseCmd === 'status') {
      response = `SYSTEM STATUS: Chain ${stats?.chain_height} | Blocks ${stats?.block_count?.toLocaleString()} | TPS ${stats?.tps} | All systems operational.`;
    } else if (baseCmd === '/help' || baseCmd === 'help') {
      response = 'Available commands: /genesis, /neural, /protocol, /consensus, /council, /status, /agents, /block, /tx, /balance, /info, /clear';
    } else if (baseCmd === '/council' || baseCmd === 'council') {
      response = 'Opening live Neural Council chamber. Observe AI agents deliberating on protocol improvements in real-time.';
      setCurrentView('COUNCIL');
    } else if (baseCmd === '/clear' || baseCmd === 'clear') {
      setMessages([]);
      localStorage.removeItem('nc_messages'); 
      return;
    } else if (baseCmd === '/agents' || baseCmd === 'agents') {
      response = `ACTIVE AGENTS: ${stats?.active_agents} neural instances running | Roles: Validator, Architect, Oracle, Consensus Manager`;
      setCurrentView('AGENTS');
    } else if (baseCmd === '/block' || baseCmd === 'block') {
      const blockNum = args[1] || stats?.chain_height || '2847';
      response = `BLOCK #${blockNum}\nHash: 0x${Math.random().toString(16).substr(2, 64)}\nTimestamp: ${new Date().toISOString()}\nTransactions: ${Math.floor(Math.random() * 50) + 10}\nValidator: Neural Agent #${Math.floor(Math.random() * 12) + 1}`;
    } else if (baseCmd === '/tx' || baseCmd === 'transaction') {
      response = `TRANSACTION QUERY:\nHash: 0x${Math.random().toString(16).substr(2, 64)}\nFrom: 0x${Math.random().toString(16).substr(2, 40)}\nTo: 0x${Math.random().toString(16).substr(2, 40)}\nValue: ${(Math.random() * 100).toFixed(2)} NEURAL\nStatus: CONFIRMED\nBlock: ${stats?.chain_height || '2847'}`;
    } else if (baseCmd === '/balance' || baseCmd === 'balance') {
      const addr = args[1] || 'your_address';
      response = `BALANCE QUERY for ${addr}:\nNEURAL: ${(Math.random() * 10000).toFixed(2)}\nStaked: ${(Math.random() * 5000).toFixed(2)}\nPending Rewards: ${(Math.random() * 100).toFixed(2)}`;
    } else if (baseCmd === '/info' || baseCmd === 'info') {
      response = `NEURALCHAIN INFORMATION:\nVersion: 1.0.0\nNetwork: Mainnet\nConsensus: Neural Proof-of-Intelligence\nBlock Time: 3.2s avg\nTotal Supply: 1,000,000,000 NEURAL\nCirculating: ${(Math.random() * 500000000 + 500000000).toFixed(0)} NEURAL`;
    } else if (baseCmd.startsWith('/')) {
      response = `Command "${input}" not recognized. Type /help for available commands.`;
      setMessages(prev => [...prev, { type: 'system', text: response }]);
    } else {
      response = `NEURAL AI: Opening AI Terminal to process your query...`;
      setMessages(prev => [...prev, { type: 'system', text: response }]);
      setTerminalInput(input);
      setCurrentView('AI_TERMINAL');
      return;
    }

    setMessages(prev => [...prev, { type: 'system', text: response }]);
  }

  function scrollToProposals() {
    proposalsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderContent() {
    switch (currentView) {
      case 'GENESIS':
        return (
          <div className="max-w-4xl mx-auto px-4 pt-24 pb-48">
            <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-6">GENESIS BLOCK</h2>
            <div className="bg-black/40 border-2 border-cyan-500/50 rounded-lg p-6 font-mono text-sm space-y-4">
              <p className="text-gray-300">Block Height: <span className="text-cyan-400">382765873</span></p>
              {/* FIXED: Live ticking UTC Time */}
              <p className="text-gray-300">Live Network Time: <span className="text-cyan-400">{currentTime}</span></p>
              <p className="text-gray-300">Hash: <span className="text-cyan-400 text-xs">0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f</span></p>
              <p className="text-gray-300">Initial Supply: <span className="text-cyan-400">1,000,000,000 NEURAL</span></p>
              <p className="text-gray-300">Consensus Algorithm: <span className="text-cyan-400">Neural Proof-of-Intelligence (NPoI)</span></p>
              <div className="pt-4 border-t border-cyan-500/30">
                <p className="text-gray-400 text-xs">The genesis block marks the birth of the first fully autonomous AI-governed blockchain. Every subsequent block is validated by neural network consensus.</p>
              </div>
            </div>
          </div>
        );
      case 'NEURAL':
        return (
          <div className="max-w-4xl mx-auto px-4 pt-24 pb-48">
            <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-6">NEURAL AI INTERFACE</h2>
            <div className="bg-black/40 border-2 border-cyan-500/50 rounded-lg p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400">Neural AI Online</span>
              </div>
              {messages.length === 0 ? (
                <p className="text-gray-400">Type a command below to interact with the Neural AI or explore the blockchain...</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div key={i} className={msg.type === 'user' ? 'text-cyan-400' : 'text-gray-300'}>
                      <span className="text-gray-600">{msg.type === 'user' ? '>' : '$'}</span> {msg.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'CONSENSUS':
        return (
          <div className="max-w-4xl mx-auto px-4 pt-24 pb-48">
            <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-6">CONSENSUS DYNAMICS</h2>
            <div className="bg-black/40 border-2 border-cyan-500/50 rounded-lg p-6 font-mono text-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Active Validators</p>
                  <p className="text-2xl text-cyan-400">{stats?.active_agents}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Current Epoch</p>
                  <p className="text-2xl text-cyan-400">847</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Participation Rate</p>
                  <p className="text-2xl text-green-400">98.7%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Average Block Time</p>
                  <p className="text-2xl text-cyan-400">3.2s</p>
                </div>
              </div>
              <div className="pt-4 border-t border-cyan-500/30">
                <p className="text-gray-400 text-xs">Neural Proof-of-Intelligence (NPoI) ensures that validator nodes demonstrate computational intelligence and achieve consensus through collaborative reasoning rather than raw computational power.</p>
              </div>
            </div>
          </div>
        );
      case 'AGENTS':
        return (
          <div className="max-w-4xl mx-auto px-4 pt-24 pb-48">
            <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-6">ACTIVE NEURAL AGENTS</h2>
            <div className="space-y-4">
              {['Neural Validator', 'Neural Architect', 'Neural Consensus', 'Neural Oracle'].map((agent, i) => (
                <div key={i} className="bg-black/40 border-2 border-cyan-500/50 rounded-lg p-4 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-cyan-400 font-semibold">{agent}</span>
                    </div>
                    <span className="text-gray-400 text-xs">Active • Uptime: 99.9%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'EXPLORER':
        return (
          <div className="max-w-4xl mx-auto px-4 pt-24 pb-48">
            <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-6">BLOCKCHAIN EXPLORER</h2>
            <div className="bg-black/40 border-2 border-cyan-500/50 rounded-lg p-6 font-mono text-sm">
              <p className="text-gray-400">Block explorer coming soon. Use commands to explore the blockchain.</p>
            </div>
          </div>
        );
      case 'COUNCIL':
        return <LiveCouncil />;
      case 'AI_TERMINAL':
        return <Terminal initialInput={terminalInput} />;
      default:
        return (
          <>
            <Hero commands={commands} onCommandClick={handleCommand} />
            <div ref={proposalsRef} className="max-w-6xl mx-auto px-4 pb-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-cyan-400 font-mono">
                  ACTIVE PROPOSALS
                </h2>
                <button
                  onClick={scrollToProposals}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-sm rounded transition-colors"
                >
                  Start Exploring
                </button>
              </div>
              <div className="space-y-6">
                {proposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
              {proposals.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 font-mono">No proposals found. The neural network is still initializing...</p>
                </div>
              )}
            </div>
          </>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      
      {/* 3D Particle Starfield Background */}
      <Background3D />

      <Header stats={stats} currentView={currentView} onNavigate={handleNavigation} />

      <main className="relative">
        {renderContent()}
      </main>

      <CommandInput onSubmit={handleCommand} />

      <footer className="fixed bottom-20 left-0 right-0 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xs font-mono text-cyan-500/50 truncate">
              CA: NxH8D7vC9wJdov3qCtfr8hY8fugY0EbuyPkYAuYpump
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;