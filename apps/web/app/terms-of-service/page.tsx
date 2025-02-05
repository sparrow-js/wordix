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
            <h1>Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last Updated: 02.02.2025</p>
            <h2>Introduction and Acceptance of Terms</h2>
            <p>
              Welcome to <strong>Wordix</strong>, a platform designed to use document flow as a workflow to execute AI
              workflows quickly and efficiently. By accessing or using our service, you agree to be bound by these Terms
              of Service. If you do not agree with any of these terms, please do not use our service.
            </p>

            <h2>Use of the Service</h2>
            <p>
              Wordix provides users with a comprehensive platform to build and launch AI workflows using our pre-built
              templates and infrastructure. You agree to use the service in accordance with all applicable local, state,
              national, and international laws and regulations.
            </p>

            <h2>User Accounts and Registration</h2>
            <ol>
              <li>
                <p>
                  <strong>Account Creation</strong>: To access certain features of the service, you need to create an
                  account. You must provide accurate and complete information during the registration process.
                </p>
              </li>
              <li>
                <p>
                  <strong>Account Security</strong>: You are responsible for maintaining the confidentiality of your
                  account credentials and for all activities that occur under your account.
                </p>
              </li>
              <li>
                <p>
                  <strong>User Responsibilities</strong>: You agree to notify us immediately of any unauthorized use of
                  your account or any other breach of security.
                </p>
              </li>
            </ol>

            <h2>User Conduct</h2>
            <p>Users agree not to use the Service to:</p>
            <ul>
              <li>Violate any laws or regulations.</li>
              <li>
                Infringe upon the rights of any third party, including copyright, trademark, privacy, or other personal
                or proprietary rights.
              </li>
            </ul>

            <h2>Acceptable Use Policy (AUP)</h2>
            <h3>Ethical and Responsible Use</h3>
            <p>
              Ensuring the ethical and responsible use of Wordix is paramount. All users of Wordix must adhere to our
              Acceptable Use Policy (AUP). It is important to clarify that Wordix does not permit users to create
              chatbots. The platform solely leverages the reasoning abilities of Claude for its functionalities.
            </p>

            <h3>API Providers and Foundational LLM Models</h3>
            <p>
              Our services are underpinned by foundational Large Language Models (LLMs), primarily provided by partners
              such as OpenAI, Claude, and Google (PaLM). Users must:
            </p>
            <ul>
              <li>
                Refrain from using LLMs for generating misleading information, deepfakes, or any content that can be
                harmful or deceitful.
              </li>
              <li>Not use LLMs to promote hate, discrimination, or violence.</li>
              <li>Respect any additional terms, guidelines, and policies set forth by our API providers.</li>
              <li>
                Ensure that any data or content used with LLMs does not violate privacy laws, intellectual property
                rights, or other legal standards.
              </li>
            </ul>

            <h3>Violations and Mitigations</h3>
            <ul>
              <li>
                <strong>User Notifications:</strong> If users are determined to be in violation of the AUP, they will
                receive notifications. They will have an opportunity to address and rectify the issue or file an appeal
                if they believe there has been an oversight.
              </li>
              <li>
                <strong>Suspension & Termination:</strong> The severity of the AUP violation will determine the
                corrective measures. This can range from temporary suspension to permanent termination of the user's
                Wordix account.
              </li>
              <li>
                <strong>Feedback System:</strong> We believe in the strength and vigilance of our community. We strongly
                encourage users and the broader community to report any deployments or actions on the platform that they
                deem questionable or in violation of the AUP.
              </li>
              <li>
                <strong>Continuous Review:</strong> In a rapidly evolving digital landscape, we are committed to
                ensuring our AUP remains robust and relevant. We routinely update our AUP based on societal standards'
                evolution and valuable feedback from our users.
              </li>
            </ul>

            <p>
              By using Wordix, you acknowledge that you have read, understood, and agreed to adhere to our AUP. Failure
              to comply can result in corrective action as detailed above.
            </p>

            <h2>Content and Intellectual Property Rights</h2>
            <p>
              All content provided through Wordix, including but not limited to templates, code, infrastructure setup,
              and documentation, is protected under copyright law. The copyright owner of Wordix is{" "}
              <strong>wordix.ai</strong>.
            </p>
            <ul>
              <li>
                You acknowledge that you do not own the underlying technology or intellectual property that makes up the
                Wordix service, and you agree to respect the intellectual property rights of wordix.ai and any third
                parties.
              </li>
              <li>
                While you retain ownership of your custom implementations and modifications, the core Wordix platform
                and templates remain the property of wordix.ai.
              </li>
            </ul>

            {/* <h2>Pricing and Payments</h2>
            <ul>
              <li>All purchases are final and non-refundable unless otherwise required by law</li>
              <li>Prices are subject to change with notice to users</li>
              <li>You agree to pay all charges associated with your selected plan</li>
              <li>Payment terms are based on your selected payment method and plan</li>
            </ul> */}

            <h2>Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the service at our sole discretion, without
              notice, for conduct that we believe violates these Terms or is harmful to other users of the service, us,
              or third parties.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              The service is provided on an "as is" and "as available" basis. We make no warranties or representations
              about the accuracy, reliability, or availability of the service and disclaim all warranties to the fullest
              extent permitted by law.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, wordix.ai shall not be liable for any direct, indirect,
              incidental, special, consequential, or punitive damages arising from the use of or inability to use the
              service.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless wordix.ai, its affiliates, and their respective officers,
              directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including
              attorneys' fees) arising from your use of the service or violation of these Terms.
            </p>

            <h2>Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
              wordix.ai operates, without regard to its conflict of law provisions. Any disputes arising from these
              Terms or the service will be resolved through binding arbitration in accordance with applicable laws.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We reserve the right to update or modify these Terms at any time. Changes will be effective immediately
              upon posting on our website. Your continued use of the service after any changes signifies your acceptance
              of the new terms.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              <a href="mailto:wordixai@gmail.com"> wordixai@gmail.com</a>.
            </p>

            <hr />
            <p>
              By using Wordix, you acknowledge that you have read, understood, and agree to be bound by these Terms of
              Service. Thank you for choosing Wordix!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
