import { useState } from 'react';

const AGENT_URL = process.env.NEXT_PUBLIC_VIIZE_AGENT_GEMINI_URL;

export default function AgentInterface() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setError(null);

    if (!AGENT_URL) {
      setError("The Viize agent URL is not configured. Please check Vercel environment variables.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(AGENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          user: 'demo-user'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      setOutput(data.message);

    } catch (err) {
      console.error("Failed to communicate with Viize agent:", err);
      setError(`Connection Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Interact with Viize-Agent-Gemini</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send to agent'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {output && (
        <div>
          <h2>Agent's Response:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}

