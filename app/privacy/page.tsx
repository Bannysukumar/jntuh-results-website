export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">
        Privacy Policy for Mana JNTUH Results
      </h1>
      <p className="mb-4">
        <strong>Effective Date:</strong> December 28, 2025
      </p>
      <p className="mb-4">
        Mana JNTUH Results ("we", "our", or "us") values your privacy. This Privacy
        Policy explains how we collect, use, and protect information when you
        use our application (the "App") or website. By using the App or website, you agree to the
        practices described below.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Personal Information:</strong> Name, email address, or student
          ID (hall ticket number) only if you voluntarily provide it when checking results or using admin features.
        </li>
        <li>
          <strong>Usage Information:</strong> Non-identifiable information such
          as app usage, device type, operating system, browser type, and IP address to improve app
          performance and user experience.
        </li>
        <li>
          <strong>Result Data:</strong> When you check results using your hall ticket number, 
          we fetch and display your academic results from JNTUH's official systems. 
          This data is not stored on our servers.
        </li>
        <li>
          <strong>Authentication Data:</strong> If you use admin features, we use Firebase Authentication 
          to securely manage your login credentials.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>Providing and improving the app's features and services</li>
        <li>Fetching and displaying your JNTUH exam results</li>
        <li>Sending important updates or notifications (if you opt-in)</li>
        <li>Understanding how users interact with the app through analytics</li>
        <li>Maintaining app security and preventing abuse</li>
        <li>Responding to user feedback and support requests</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        3. Sharing of Information
      </h2>
      <p className="mb-4">
        We do <strong>not</strong> sell, rent, or trade your personal
        information to third parties. We may share non-identifiable, aggregated
        data for research or analytics purposes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        We implement reasonable security measures to protect your information.
        However, no app or internet transmission is completely secure, and we
        cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        5. Third-Party Services
      </h2>
      <p className="mb-4">
        Our app uses the following third-party services that have their own privacy policies:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Firebase (Google):</strong> Used for authentication, database (Firestore), 
          and analytics. <a href="https://firebase.google.com/support/privacy" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Firebase Privacy Policy</a>
        </li>
        <li>
          <strong>Google Analytics:</strong> Used to understand app usage and improve user experience. 
          <a href="https://policies.google.com/privacy" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer"> Google Privacy Policy</a>
        </li>
        <li>
          <strong>Vercel:</strong> Our hosting provider. 
          <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer"> Vercel Privacy Policy</a>
        </li>
      </ul>
      <p className="mb-4">
        We encourage you to review these policies as we are not responsible for their practices.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        6. Children’s Privacy
      </h2>
      <p className="mb-4">
        Our App is intended for students over the age of 13. We do not knowingly
        collect personal information from children under 13.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        7. Changes to This Privacy Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. The updated version
        will be posted in the app with the “Effective Date” updated accordingly.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at: <br />
        <a
          href="mailto:bannysukumar@gmail.com"
          className="text-blue-600 underline"
        >
          bannysukumar@gmail.com
        </a>
      </p>
    </div>
  );
}
