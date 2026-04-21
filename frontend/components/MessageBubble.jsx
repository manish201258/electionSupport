export default function MessageBubble({ role, text }) {
  return (
    <article className={`messageBubble ${role}`}>
      <span className="senderLabel">{role === 'user' ? 'You' : 'Assistant'}</span>
      <p>{text}</p>
    </article>
  );
}
