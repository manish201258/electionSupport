import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TimelineCard from '../components/TimelineCard';
import { fetchTimeline } from '../utils/api';

const regions = ['national', 'rajasthan', 'maharashtra', 'karnataka'];

export default function TimelinePage() {
  const [region, setRegion] = useState('national');
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchTimeline(region)
      .then((res) => setItems(res.items || []))
      .catch(() => setItems([]));
  }, [region]);

  return (
    <main id="main-content" className="pageLayout" role="main">
      <header className="pageHeader">
        <Link href="/" className="ghostBtn">
          Back Home
        </Link>
        <h1>Election Timeline Viewer</h1>
        <p>Understand all phases from official announcement to counting and declaration.</p>
      </header>

      <section className="panel regionSelectWrap">
        <label htmlFor="region">Region</label>
        <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
          {regions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>

      <section className="timelineGrid">
        {items.map((item, index) => (
          <TimelineCard key={`${item.phase}-${index}`} item={item} />
        ))}
      </section>
    </main>
  );
}
