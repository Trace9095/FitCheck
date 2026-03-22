import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Fit Check terms of service and usage policies.',
}

export default function TermsPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Terms of <span className="text-gold">Service</span>
          </h1>
          <p className="mt-2 text-muted">Last updated: March 2026</p>
        </div>

        <div className="prose-custom space-y-8">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using Fit Check (&ldquo;the App&rdquo;), you agree to be bound by these
              Terms of Service. If you do not agree, please do not use the App.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              Fit Check is a community platform for posting outfit photos, receiving anonymous
              ratings, and discovering personal style through AI analysis. Features include outfit
              posting, community voting, wardrobe tracking, style challenges, and AI-powered style
              profiles.
            </p>
          </Section>

          <Section title="3. User Accounts">
            <p>
              You must provide a valid email address to create an account. You are responsible for
              maintaining the security of your account. We use passwordless magic links for
              authentication.
            </p>
            <p>
              You must be at least 13 years old to use the App. By creating an account, you confirm
              you meet this requirement.
            </p>
          </Section>

          <Section title="4. User Content">
            <p>
              You retain ownership of content you upload. By posting, you grant Fit Check a
              worldwide, non-exclusive license to display and distribute your content within the App.
            </p>
            <p>You agree not to post content that is:</p>
            <ul>
              <li>Illegal, harmful, or offensive</li>
              <li>Sexually explicit or pornographic</li>
              <li>Harassing or targeted at individuals</li>
              <li>In violation of third-party intellectual property rights</li>
            </ul>
            <p>
              We reserve the right to remove any content at our discretion and to terminate accounts
              that violate these terms.
            </p>
          </Section>

          <Section title="5. Ratings and Community">
            <p>
              Ratings on Fit Check are anonymous. We do not guarantee the accuracy or fairness of
              community ratings. Misuse of the rating system (e.g., coordinated rating manipulation)
              is prohibited.
            </p>
          </Section>

          <Section title="6. Subscriptions and Payments">
            <p>
              Paid features include the Pro subscription ($2.99/month) and the Stylist one-time
              purchase ($4.99). Payments are processed by Stripe. Subscriptions renew automatically
              unless canceled before the renewal date.
            </p>
            <p>
              Refunds for subscriptions may be requested within 7 days of purchase. One-time
              purchases (Stylist) are non-refundable once the AI analysis has been generated.
            </p>
          </Section>

          <Section title="7. Privacy">
            <p>
              Your use of the App is also governed by our{' '}
              <Link href="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms.
            </p>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p>
              The App is provided &ldquo;as is&rdquo; without warranty of any kind. We do not
              guarantee uninterrupted, error-free service. AI style analyses are for entertainment
              and informational purposes only.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Fit Check shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of the App.
            </p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>
              We may update these Terms at any time. Continued use of the App after changes
              constitutes acceptance of the new Terms. Material changes will be communicated via
              email.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              Questions? Email us at{' '}
              <a href="mailto:hello@fitcheckapp.com" className="text-gold hover:underline">
                hello@fitcheckapp.com
              </a>
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      <div className="space-y-3 text-sm text-muted leading-relaxed [&_a]:text-gold [&_a:hover]:underline [&_ul]:ml-4 [&_ul]:mt-2 [&_ul]:space-y-1 [&_ul]:list-disc">
        {children}
      </div>
    </div>
  )
}
