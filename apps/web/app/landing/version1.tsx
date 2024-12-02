import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, CheckCircle, FileText, Globe, Shield, Star, User, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <Link className="flex items-center justify-center" href="#">
          <FileText className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Wordix</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </Link>
          <Button variant="ghost" className="hidden sm:inline-flex" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Sign in</span>
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 bg-gradient-to-r from-[#F3F4F6]/95 to-[#E5E7EB]/50">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 mt-16 overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    AI-Powered Content Creation Made Simple
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Transform your ideas into polished content with Wordix. Our advanced AI helps you generate, refine,
                    and perfect your writing in seconds.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                    asChild
                  >
                    <Link href="/app">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>

              <div className="relative h-[400px] md:h-[600px]">
                <img
                  src="/wordix-ui.png"
                  alt="Platform Demo"
                  className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-10 w-10" />}
                title="Advanced AI Generation"
                description="State-of-the-art language models that understand context and generate human-like text."
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10" />}
                title="Multiple Content Types"
                description="Generate blog posts, articles, social media content, and more with specialized optimization."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10" />}
                title="Collaborative Writing"
                description="Work together with AI to refine and perfect your content in real-time."
              />
              <FeatureCard
                icon={<Globe className="h-10 w-10" />}
                title="Multi-Language Support"
                description="Create content in multiple languages with native-level quality."
              />
              <FeatureCard
                icon={<BarChart className="h-10 w-10" />}
                title="SEO Optimization"
                description="AI-powered suggestions to improve your content's search engine visibility."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10" />}
                title="Content Safety"
                description="Advanced filters and checks to ensure your content meets quality and safety standards."
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16">
              How It Works
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Simple and effective workflow to transform your ideas into polished content
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
              <WorkflowStep
                number={1}
                title="Input"
                description="Share your ideas or requirements"
                icon={<FileText className="h-6 w-6" />}
              />
              <ArrowRight className="hidden md:block h-8 w-8 text-primary/30 rotate-0 md:rotate-0" />
              <WorkflowStep
                number={2}
                title="Generate"
                description="Let AI create initial content"
                icon={<Zap className="h-6 w-6" />}
              />
              <ArrowRight className="hidden md:block h-8 w-8 text-primary/30 rotate-0 md:rotate-0" />
              <WorkflowStep
                number={3}
                title="Refine"
                description="Edit and perfect with AI assistance"
                icon={<Users className="h-6 w-6" />}
              />
              <ArrowRight className="hidden md:block h-8 w-8 text-primary/30 rotate-0 md:rotate-0" />
              <WorkflowStep
                number={4}
                title="Publish"
                description="Export and share your content"
                icon={<Globe className="h-6 w-6" />}
              />
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Pricing Plans
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <PricingCard
                title="Starter"
                price="$9"
                description="Perfect for individual content creators"
                features={["5,000 words per month", "Basic AI generation", "3 content types", "Email support"]}
              />
              <PricingCard
                title="Professional"
                price="$29"
                description="Ideal for growing businesses"
                features={[
                  "50,000 words per month",
                  "Advanced AI features",
                  "All content types",
                  "Priority support",
                  "SEO optimization",
                ]}
                highlighted={true}
              />
              <PricingCard
                title="Enterprise"
                price="Custom"
                description="For large-scale content needs"
                features={[
                  "Unlimited words",
                  "Custom AI training",
                  "API access",
                  "24/7 support",
                  "Advanced analytics",
                  "Custom integrations",
                ]}
              />
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="Wordix has revolutionized our content creation process. The AI understands our brand voice perfectly."
                author="Sarah Johnson"
                title="Content Manager, TechBlog"
              />
              <TestimonialCard
                quote="The multi-language support is incredible. We've expanded our reach to global markets effortlessly."
                author="Michael Chen"
                title="Marketing Director, GlobalTech"
              />
              <TestimonialCard
                quote="As a freelance writer, Wordix has doubled my productivity while maintaining quality."
                author="Emily Rodriguez"
                title="Content Creator"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Elevate Your Document Management?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of satisfied customers and experience the power of DocFlow. Sign up now and enjoy a
                  14-day free trial. No credit card required.
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  size="lg"
                  className="transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Product</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
            <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 DocFlow. All rights reserved.</p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-500 
hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all hover:shadow-xl">
      <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function WorkflowStep({ number, title, description, icon }) {
  return (
    <div className="group flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 max-w-[280px]">
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all duration-300">
        {icon}
      </div>
      <div className="mb-4 rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center text-lg font-bold text-primary">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, description, features, highlighted = false }) {
  return (
    <div
      className={`flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${
        highlighted ? "ring-2 ring-primary" : ""
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="text-4xl font-bold mb-2">
        {price}
        <span className="text-lg font-normal">/mo</span>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 
          ${highlighted ? "bg-primary text-primary-foreground" : ""}`}
      >
        Choose Plan
      </Button>
    </div>
  );
}

function TestimonialCard({ quote, author, title }) {
  return (
    <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex-grow">
        <Star className="h-6 w-6 text-yellow-400 mb-4" />
        <p className="italic mb-4">"{quote}"</p>
      </div>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}
