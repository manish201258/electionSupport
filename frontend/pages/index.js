import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { logEvent } from '../utils/firebase';
import GoogleServicesPanel from '../components/GoogleServicesPanel';

export default function HomePage() {
  useEffect(() => {
    logEvent('home_page_view', { source: 'web' });
  }, []);

  return (
    <main id="main-content" className="heroLayout" role="main">
      <section className="heroBlock">
        <p className="eyebrow">Election Literacy Hub</p>
        <h1>Learn the full election process without confusion</h1>
        <p>
          Understand eligibility, timelines, booth process, and official voting steps through
          interactive guidance.
        </p>
        <div className="heroActions">
          <Link href="/guide" className="primaryBtn">
            Start Learning
          </Link>
          <Link href="/chat" className="ghostBtn">
            Ask Assistant
          </Link>
        </div>
      </section>

      <section className="floatingCardGrid">
        <article>
          <h3>Step-by-step Guidance</h3>
          <p>Simple flow from registration to result day awareness.</p>
        </article>
        <article>
          <h3>Timeline Explorer</h3>
          <p>Track phases from nominations to counting and results.</p>
        </article>
        <article>
          <h3>Regional Context</h3>
          <p>Select your state for localized awareness updates.</p>
        </article>
      </section>

      <GoogleServicesPanel pageName="home" region="national" />
    </main>
  );
}
