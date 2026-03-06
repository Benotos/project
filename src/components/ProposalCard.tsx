import { useState } from 'react';
import { Proposal } from '../lib/supabase';
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // FIXED: Added local state to handle voting interactions visually
  const [voted, setVoted] = useState<'none' | 'approve' | 'reject'>('none');
  const [localVotesFor, setLocalVotesFor] = useState(proposal.votes_for);
  const [localVotesTotal, setLocalVotesTotal] = useState(proposal.votes_total);

  const percentage = localVotesTotal > 0 ? Math.round((localVotesFor / localVotesTotal) * 100) : 0;
  
  const statusColors = {
    RATIFIED: 'bg-cyan-500',
    PENDING: 'bg-yellow-500',
    FOUNDATIONAL: 'bg-blue-500',
  };

  const categoryColors = {
    PHILOSOPHICAL: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    TECHNICAL: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    GOVERNANCE: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  const handleVote = (type: 'approve' | 'reject') => {
    if (voted !== 'none') return; // Prevent voting twice
    setVoted(type);
    setLocalVotesTotal(prev => prev + 1);
    if (type === 'approve') {
      setLocalVotesFor(prev => prev + 1);
    }
  };

  return (
    <div className="bg-black/40 border-2 border-cyan-500/50 rounded-lg p-6 hover:border-cyan-400/70 transition-all backdrop-blur-sm group">
      <div className="flex gap-2 mb-4">
        <span className={`px-2 py-1 rounded text-xs font-mono font-semibold ${statusColors[proposal.status as keyof typeof statusColors] || 'bg-gray-500'}`}>
          NIP-{proposal.nip_number}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-mono font-semibold ${statusColors[proposal.status as keyof typeof statusColors] || 'bg-gray-500'}`}>
          {proposal.status}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-mono font-semibold border ${categoryColors[proposal.category as keyof typeof categoryColors] || 'bg-gray-500/20 text-gray-300'}`}>
          {proposal.category}
        </span>
      </div>

      <h3 className="text-cyan-400 font-semibold text-lg mb-3 group-hover:text-cyan-300 transition-colors">
        {proposal.title}
      </h3>

      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        {proposal.description}
      </p>

      {isExpanded && (
        <div className="mt-6 space-y-4 border-t border-cyan-500/30 pt-6">
          <div className="bg-black/20 border border-cyan-500/30 rounded p-4">
            <h4 className="text-cyan-400 font-semibold mb-2 text-sm">Full Proposal Details</h4>
            <p className="text-gray-400 text-xs font-mono leading-relaxed">
              This proposal represents a fundamental shift in how blockchain consensus mechanisms operate.
              By leveraging neural network instances as validators and consensus participants, NeuralChain
              demonstrates that autonomous AI systems can successfully govern distributed ledger technology.
            </p>
            <p className="text-gray-400 text-xs font-mono leading-relaxed mt-3">
              The proposal outlines the technical architecture, economic incentives, and governance framework
              required to maintain a stable, secure, and efficient AI-governed blockchain network.
            </p>
          </div>

          {/* FIXED: Voting logic renders buttons if not voted, or a success message if already voted */}
          {voted === 'none' ? (
            <div className="flex gap-3">
              <button 
                onClick={() => handleVote('approve')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded font-mono text-sm hover:bg-green-500/30 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Vote Approve
              </button>
              <button 
                onClick={() => handleVote('reject')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded font-mono text-sm hover:bg-red-500/30 transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                Vote Reject
              </button>
            </div>
          ) : (
            <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded font-mono text-sm border ${voted === 'approve' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
              <CheckCircle className="w-4 h-4" />
              Vote Registered: {voted.toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-cyan-500/30">
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-gray-400">
            Author: <span className="text-cyan-400">{proposal.author}</span>
          </span>
          <span className="text-gray-400 flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            Votes: <span className="text-green-400">{localVotesFor}/{localVotesTotal}</span>
            <span className="text-green-400 font-semibold ml-1">{percentage}% APPROVE</span>
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-cyan-400 text-xs font-mono hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          {isExpanded ? 'Collapse' : 'Click to expand'}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}