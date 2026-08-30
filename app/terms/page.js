export const metadata = {
  title: "Terms of Service — Qwikko",
};

export default function Terms() {
  return (
    <main style={{ padding: "24px", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
      <h1>Terms of Service</h1>
      <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

      <p>
        By using Qwikko, you agree to these terms. If you don't agree,
        please don't use the service.
      </p>

      <h2>1. What Qwikko provides</h2>
      <p>
        Qwikko lets you generate QR codes and create short, trackable
        smart links. Some features are available without an account;
        others require signing in.
      </p>

      <h2>2. Acceptable use</h2>
      <p>You agree not to use Qwikko to create QR codes or links that:</p>
      <ul>
        <li>Point to illegal content or facilitate illegal activity</li>
        <li>Distribute malware, phishing pages, or scams</li>
        <li>Harass, defame, or harm others</li>
        <li>Infringe on someone else's intellectual property</li>
      </ul>
      <p>We reserve the right to disable any link or account that violates this.</p>

      <h2>3. Guest links</h2>
      <p>
        Links and QR codes created without an account are not tied to any
        identity and cannot be recovered, edited, or deleted once created,
        other than by us if they violate these terms.
      </p>

      <h2>4. Accounts</h2>
      <p>
        You're responsible for keeping your account credentials secure.
        You're responsible for the links and content associated with your
        account.
      </p>

      <h2>5. Service availability</h2>
      <p>
        Qwikko is provided "as is." We do not guarantee uninterrupted
        availability, and we are not liable for losses resulting from
        downtime, data loss, or link/redirect failures.
      </p>

      <h2>6. Changes</h2>
      <p>
        We may update these terms as the service evolves. Continued use
        after changes means you accept the updated terms.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about these terms can be sent to the contact details
        provided on our homepage.
      </p>
    </main>
  );
  }
