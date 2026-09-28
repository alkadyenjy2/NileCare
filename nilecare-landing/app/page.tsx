import ContactForm from "./ContactForm";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">NileCare</p>
        <h1>Clinic coordination, simplified.</h1>
        <p className="lead">NileCare organizes real clinic inquiries from first contact to verified operational handoff — without diagnosing, inventing prices, or promising medical outcomes.</p>
        <a className="cta" href="#contact">Request coordination</a>
      </section>
      <section className="grid">
        <article><h2>Intake & routing</h2><p>Capture the inquiry, qualify the request, and route it to a real participating clinic or service.</p></article>
        <article><h2>Communication</h2><p>Keep clinic-approved communication and operational events organized. WhatsApp can be connected when the real channel is provisioned.</p></article>
        <article><h2>Payment handoff</h2><p>The MVP can use a clinic-approved manual payment method. A lead is never marked paid without evidence.</p></article>
      </section>
      <section id="contact" className="contact">
        <h2>Start with a real clinic service</h2>
        <p>Pricing and package terms are published only after a participating clinic approves the exact scope.</p>
        <ContactForm />
      </section>
    </main>
  );
}
