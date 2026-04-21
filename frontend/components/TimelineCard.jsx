export default function TimelineCard({ item }) {
  return (
    <div className="timelineCard">
      <p className="timelineDate">{item.date}</p>
      <h3>{item.phase}</h3>
      <p>{item.description}</p>
      <span className="chip">{item.region}</span>
    </div>
  );
}
