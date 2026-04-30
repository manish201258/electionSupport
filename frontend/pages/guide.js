import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import StepCard from '../components/StepCard';
import { fetchSteps } from '../utils/api';
import { logEvent } from '../utils/firebase';

export default function GuidePage() {
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchSteps()
      .then((res) => setSteps(res.items || []))
      .catch(() => setSteps([]));
  }, []);

  useEffect(() => {
    logEvent('guide_page_view', { step: index + 1 });
  }, [index]);

  const currentStep = useMemo(() => steps[index], [steps, index]);
  const isFirst = index === 0;
  const isLast = index === Math.max(steps.length - 1, 0);

  return (
    <main id="main-content" className="pageLayout" role="main">
      <header className="pageHeader">
        <Link href="/" className="ghostBtn">
          Back Home
        </Link>
        <h1>Step-by-Step Voting Guide</h1>
        <p>Move through each stage and complete your election readiness checklist.</p>
      </header>

      <section className="panel guideWrap">
        {currentStep ? (
          <>
            <StepCard step={currentStep} current={index + 1} total={steps.length} />
            <div className="guideActions">
              <button
                type="button"
                disabled={isFirst}
                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              >
                Previous
              </button>
              {!isLast ? (
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
                >
                  Next
                </button>
              ) : (
                <button type="button" onClick={() => setIndex(0)}>
                  Restart
                </button>
              )}
            </div>
          </>
        ) : (
          <p>Loading steps...</p>
        )}
      </section>

      <section className="panel inlineLinks">
        <Link href="/timeline">Open Timeline</Link>
        <Link href="/chat">Ask Assistant</Link>
      </section>
    </main>
  );
}
