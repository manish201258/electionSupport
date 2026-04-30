import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { fetchRecentAnnouncements, submitFeedback, logEvent } from '../utils/firebase';
import { fetchAnnouncements } from '../utils/api';

export default function GoogleServicesPanel({ pageName, region }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAnnouncements() {
      setLoading(true);
      const items = await fetchRecentAnnouncements();
      if (cancelled) {
        return;
      }
      if (items.length > 0) {
        setAnnouncements(items);
      } else {
        const fallback = await fetchAnnouncements(region);
        if (!cancelled) {
          setAnnouncements(fallback.items || []);
        }
      }
      setLoading(false);
      logEvent('announcements_loaded', { count: items.length, page: pageName });
    }

    loadAnnouncements();

    return () => {
      cancelled = true;
    };
  }, [pageName, region]);

  const hasAnnouncements = useMemo(() => announcements.length > 0, [announcements]);

  async function onSubmit(event) {
    event.preventDefault();
    setStatus('Submitting feedback...');

    const result = await submitFeedback({
      page: pageName,
      region,
      rating,
      comment,
    });

    if (result.ok) {
      setStatus(`Feedback sent successfully via ${result.source || 'firebase'}. Thank you.`);
      setComment('');
      return;
    }

    setStatus('Feedback storage is not configured yet. Add Firebase config to enable this.');
  }

  return (
    <section className="panel servicePanel" aria-labelledby="google-services-heading">
      <h2 id="google-services-heading">Google Services Hub</h2>
      <p className="serviceSubtext">
        This section uses live Firebase when enabled and falls back to the app backend when it is not.
      </p>

      <div className="serviceGrid">
        <article className="serviceCard" aria-live="polite">
          <h3>Recent verified updates</h3>
          {loading ? <p>Loading announcements...</p> : null}
          {!loading && !hasAnnouncements ? (
            <p>No live updates configured yet. Add Firestore announcements to display them.</p>
          ) : null}
          {hasAnnouncements ? (
            <ul className="serviceList">
              {announcements.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <span className="chip">{item.region}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </article>

        <article className="serviceCard">
          <h3>Share your learning feedback</h3>
          <form onSubmit={onSubmit} className="serviceForm">
            <label htmlFor="feedback-rating">Rating</label>
            <select
              id="feedback-rating"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Needs improvement</option>
              <option value="1">1 - Poor</option>
            </select>

            <label htmlFor="feedback-comment">Comment</label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={250}
              placeholder="Tell us what helped and what should be improved."
            />

            <button type="submit">Send feedback</button>
          </form>
          {status ? <p className="serviceStatus">{status}</p> : null}
        </article>
      </div>
    </section>
  );
}