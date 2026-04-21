import { useEffect, useState } from 'react';
import Link from 'next/link';
import ChatBox from '../components/ChatBox';
import { fetchFaq } from '../utils/api';

const regions = ['national', 'rajasthan', 'maharashtra', 'karnataka'];

export default function ChatPage() {
  const [region, setRegion] = useState('national');
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    fetchFaq()
      .then((res) => setFaq(res.items || []))
      .catch(() => setFaq([]));
  }, []);

  return (
    <main className="pageLayout">
      <header className="pageHeader">
        <Link href="/" className="ghostBtn">
          Back Home
        </Link>
        <h1>Election Assistant</h1>
        <p>Ask anything about election procedure, documents, timelines, and voter rights.</p>
      </header>

      <section className="panel regionSelectWrap">
        <label htmlFor="region">Select region</label>
        <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
          {regions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>

      <ChatBox region={region} />

      <section className="panel">
        <h2>Quick FAQ</h2>
        <div className="faqList">
          {faq.map((item, idx) => (
            <details key={idx}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
