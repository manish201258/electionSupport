import React from 'react';

export default function MessageBubble({ role, text }) {
  return (
    <article className={`messageBubble ${role}`} aria-label={`${role} message`}>
      <span className="senderLabel">{role === 'user' ? 'You' : 'Assistant'}</span>
      <p>{text}</p>
    </article>
  );
}
