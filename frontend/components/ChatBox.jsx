import React from 'react';
import { useState } from 'react';
import MessageBubble from './MessageBubble';
import { askAssistant } from '../utils/api';
import { logEvent } from '../utils/firebase';

export default function ChatBox({ region }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask me anything about election process, voter eligibility, or voting day steps.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError('');
    setLoading(true);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    logEvent('assistant_question_asked', { region, length: trimmed.length });

    try {
      const result = await askAssistant(trimmed, region);
      setMessages((prev) => [...prev, { role: 'assistant', text: result.reply }]);
      logEvent('assistant_response_received', { region });
    } catch (err) {
      setError(err.message || 'Failed to fetch response');
      logEvent('assistant_response_error', { region });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Election Assistant</h2>
      <div className="chatWindow" role="log" aria-live="polite" aria-relevant="additions text">
        {messages.map((message, index) => (
          <MessageBubble key={`${message.role}-${index}`} role={message.role} text={message.text} />
        ))}
        {loading && <MessageBubble role="assistant" text="Thinking through election steps for you..." />}
      </div>

      {error && <p className="errorText">{error}</p>}

      <form onSubmit={onSend} className="chatForm">
        <label htmlFor="chat-input" className="srOnly">
          Ask your election question
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: How do first-time voters cast vote?"
          maxLength={500}
          aria-required="true"
        />
        <button type="submit" disabled={loading} aria-busy={loading}>
          Send
        </button>
      </form>
    </section>
  );
}
