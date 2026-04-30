import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TimelineCard from '../components/TimelineCard';
import { fetchTimeline } from '../utils/api';
import { logEvent } from '../utils/firebase';

const regions = ['national', 'rajasthan', 'maharashtra', 'karnataka'];
const regionLabels = {
  national: 'National',
  rajasthan: 'Rajasthan',
  maharashtra: 'Maharashtra',
  karnataka: 'Karnataka',
};

export default function TimelinePage() {
  const [region, setRegion] = useState('national');
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchTimeline(region)
      .then((res) => setItems(res.items || []))
      .catch(() => setItems([]));
  }, [region]);

  useEffect(() => {
    logEvent('timeline_page_view', { region });
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
        <select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-describedby="timeline-region-help"
        >
          {regions.map((option) => (
            <option key={option} value={option}>
              {regionLabels[option]}
            </option>
          ))}
        </select>
        <p id="timeline-region-help" className="srOnly">
          Choose a region to filter election timeline updates.
        </p>
      </section>

      <section className="timelineGrid">
        {items.map((item, index) => (
          <TimelineCard key={`${item.phase}-${index}`} item={item} />
        ))}
      </section>
    </main>
  );
}
