export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">NileCare</p>
        <h1>Clinic coordination, simplified.</h1>
        <p className="lead">A coordination layer connecting clinics, patients, communication and payment workflows.</p>
        <a className="cta" href="#contact">Request coordination</a>
      </section>
      <section className="grid">
        <article><h2>Clinic coordination</h2><p>Structured intake, matching and operational handoff.</p></article>
        <article><h2>WhatsApp workflow</h2><p>Conversation-ready workflows with verified delivery evidence.</p></article>
        <article><h2>Payment handoff</h2><p>Payment is only marked complete after provider evidence.</p></article>
      </section>
      <section id="contact" className="contact">
        <h2>Start with a real clinic offer</h2>
        <p>NileCare does not publish invented pricing or unsupported claims.</p>
      </section>
    </main>
  );
}
