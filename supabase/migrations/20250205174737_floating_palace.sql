/*
  # Twitter Interactions Schema

  1. New Tables
    - `twitter_interactions`
      - `id` (uuid, primary key)
      - `user_address` (text, wallet address)
      - `twitter_handle` (text)
      - `interaction_type` (text)
      - `interaction_data` (jsonb)
      - `token_id` (integer)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `twitter_interactions` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS twitter_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address text NOT NULL,
  twitter_handle text NOT NULL,
  interaction_type text NOT NULL,
  interaction_data jsonb NOT NULL DEFAULT '{}',
  token_id integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE twitter_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own interactions"
  ON twitter_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_address);

CREATE POLICY "Users can insert their own interactions"
  ON twitter_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_address);