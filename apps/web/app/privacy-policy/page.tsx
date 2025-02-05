"use client";

import "./markdown.css";
import { Home } from "lucide-react";

export default function Page() {
  return (
    <main>
      <div>
        <a className="text-base-content cursor-pointer left-8 top-8 absolute" href="/">
          <Home />
        </a>
        <div className="max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8">
          <div className="max-w-full overflow-x-auto markdown">
            <h1>Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: 02.02.2025</p>

            <h2>1. Introduction</h2>
            <p>
              Thank you for using Wordix. Protecting your privacy is essential to us. This Privacy Policy outlines how
              Wordix (“Wordix”, “we”, “us”) collects, uses, and protects your personal information.
            </p>
            <h2>2. Information We Collect</h2>
            <p>
              <strong>Account Information:</strong> When you sign up for an account with Wordix, we collect your name,
              email address, and password.
            </p>
            <p>
              <strong>Usage Information:</strong> We collect information about the applications you create, the tools
              you use, and how you interact with our platform.
            </p>
            <p>
              <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to
              enhance user experience and to analyze traffic patterns.
            </p>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To provide, maintain, and improve the Service.</li>
              <li>To analyze usage patterns and trends to improve user experience.</li>
              <li>To send you updates, security alerts, and support messages.</li>
              <li>To communicate with you about products, services, offers, promotions, and events.</li>
            </ul>
            <h2>4. Data Storage and Analysis</h2>
            <p>
              We store and analyze the data related to the applications created using the Service to improve our
              offerings. The analysis is strictly for service enhancement and will not be used for any independent
              purposes.
            </p>
            <h2>5. Sharing of Information</h2>
            <p>
              We do not sell or lease your personal information to third parties. We might share your information with
              third-party service providers that support our Service, under strict confidentiality agreements.
            </p>
            <h2>6. Security</h2>
            <p>
              We employ a variety of security measures designed to protect your information and keep it confidential and
              free from any unauthorized alteration. However, no system can be 100% secure, and there's a risk that data
              transmission over the internet may be intercepted or accessed by unauthorized parties.
            </p>
            <h2>7. Your Rights</h2>
            <p>
              Depending on where you reside, you may have the right to access, correct, or delete the personal
              information we hold about you. You can access and update most of this information through your Wordix
              account.
            </p>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may revise this Privacy Policy from time to time, and we will post the most current version on our
              website. If a revision meaningfully impacts your rights, we will notify you.
            </p>
            <h2>9. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy or our practices, please contact us at:{" "}
              <a href="mailto:wordixai@gmail.com">wordixai@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
