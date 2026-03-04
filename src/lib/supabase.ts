import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface NetworkStats {
  id: string;
  chain_height: number;
  block_count: number;
  tps: number;
  active_agents: number;
  updated_at: string;
}

export interface Proposal {
  id: string;
  nip_number: number;
  title: string;
  description: string;
  category: string;
  status: string;
  author: string;
  votes_for: number;
  votes_total: number;
  created_at: string;
}

export interface Command {
  id: string;
  command: string;
  description: string;
  created_at: string;
}
