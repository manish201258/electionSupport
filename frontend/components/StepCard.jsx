export default function StepCard({ step, current, total }) {
  return (
    <article className="stepCard">
      <p className="stepCount">
        Step {current} of {total}
      </p>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </article>
  );
}
