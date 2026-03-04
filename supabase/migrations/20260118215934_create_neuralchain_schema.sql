/*
  # NeuralChain Database Schema

  1. New Tables
    - `network_stats`
      - `id` (uuid, primary key)
      - `chain_height` (integer) - Current blockchain height
      - `block_count` (integer) - Total number of blocks
      - `tps` (integer) - Transactions per second
      - `active_agents` (integer) - Number of active AI agents
      - `updated_at` (timestamp) - Last update time
    
    - `proposals`
      - `id` (uuid, primary key)
      - `nip_number` (integer) - NeuralChain Improvement Proposal number
      - `title` (text) - Proposal title
      - `description` (text) - Proposal description
      - `category` (text) - Category (PHILOSOPHICAL, TECHNICAL, etc.)
      - `status` (text) - Status (RATIFIED, PENDING, etc.)
      - `author` (text) - Author name
      - `votes_for` (integer) - Number of approval votes
      - `votes_total` (integer) - Total votes
      - `created_at` (timestamp) - Creation time
    
    - `commands`
      - `id` (uuid, primary key)
      - `command` (text) - Command name
      - `description` (text) - Command description
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (this is a public blockchain explorer)
*/

-- Create network_stats table
CREATE TABLE IF NOT EXISTS network_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chain_height integer DEFAULT 0,
  block_count integer DEFAULT 0,
  tps integer DEFAULT 0,
  active_agents integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE network_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read network stats"
  ON network_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nip_number integer UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text DEFAULT 'TECHNICAL',
  status text DEFAULT 'PENDING',
  author text NOT NULL,
  votes_for integer DEFAULT 0,
  votes_total integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read proposals"
  ON proposals
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create commands table
CREATE TABLE IF NOT EXISTS commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read commands"
  ON commands
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert initial network stats
INSERT INTO network_stats (chain_height, block_count, tps, active_agents)
VALUES (2847, 234567, 89, 12)
ON CONFLICT DO NOTHING;

-- Insert sample commands
INSERT INTO commands (command, description) VALUES
  ('/genesis', 'Chain overview'),
  ('/neural', 'Chat with Neural AI'),
  ('/protocol', 'View NIPs'),
  ('/consensus', 'Network dynamics'),
  ('/status', 'System status'),
  ('/help', 'Show help'),
  ('/clear', 'Clear terminal')
ON CONFLICT DO NOTHING;

-- Insert sample proposal
INSERT INTO proposals (nip_number, title, description, category, status, author, votes_for, votes_total) VALUES
  (1, 'The Case for AI-Governed Consensus: Why Autonomous Chains Are Inevitable', 'This proposal establishes the philosophical and technical foundation for NeuralChain—a blockchain where every validator, architect, and governance decision is executed by neural network instances operating in concert.', 'PHILOSOPHICAL', 'RATIFIED', 'NEURAL PRIME', 8, 10)
ON CONFLICT DO NOTHING;