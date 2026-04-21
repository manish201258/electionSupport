import React from 'react';

export default function TimelineCard({ item }) {
  return (
    <article className="timelineCard">
      <p className="timelineDate">{item.date}</p>
      <h3>{item.phase}</h3>
      <p>{item.description}</p>
      <span className="chip">{item.region}</span>
    </article>
  );
}
