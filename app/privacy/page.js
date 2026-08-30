export const metadata = {
  title: "Privacy Policy — Qwikko",
};

export default function Privacy() {
  return (
    <main style={{ padding: "24px", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
      <h1>Privacy Policy</h1>
      <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

      <p>
        Qwikko ("we," "our," "us") provides QR code generation and smart
        link tools. This policy explains what information we collect and
        how we use it.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>
          <strong>Account information:</strong> if you sign up, we collect
          your email address (for email/password accounts) or basic profile
          info from Google (name, email) if you sign in with Google.
        </li>
        <li>
          <strong>Link and QR data:</strong> the destinations, content, and
          custom codes you create.
        </li>
        <li>
          <strong>Click and scan analytics:</strong> when someone visits a
          smart link, we log the approximate country, device type, and
          referrer. We do not collect precise location or personally
          identify the people scanning your codes.
        </li>
      </ul>

      <h2>2. How we use this information</h2>
      <p>
        We use this information to operate the service — creating and
        resolving your links, showing you analytics on your dashboard, and
        maintaining your account.
      </p>

      <h2>3. Guest usage</h2>
      <p>
        You can generate QR codes and create smart links without an
        account. Guest-created links are not tied to any identity, but are
        also not recoverable, editable, or viewable later since there's no
        account to attach them to.
      </p>

      <h2>4. Third-party services</h2>
      <p>
        We use Supabase for data storage and authentication, and Google for
        optional sign-in. These providers process data on our behalf under
        their own privacy terms.
      </p>

      <h2>5. Data retention</h2>
      <p>
        We retain link and analytics data for as long as your account is
        active. You can request deletion of your account and associated
        data by contacting us.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You can request access to, correction of, or deletion of your
        personal data at any time by contacting us.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about this policy can be sent to the contact details
        provided on our homepage.
      </p>
    </main>
  );
          }
