import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Fit Check collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Privacy <span className="text-gold">Policy</span>
          </h1>
          <p className="mt-2 text-muted">Last updated: March 2026</p>
        </div>

        <div className="space-y-8">
          <Section title="1. Information We Collect">
            <p>We collect the following information when you use Fit Check:</p>
            <ul>
              <li>
                <strong className="text-foreground">Account data:</strong> Email address (required
                for authentication)
              </li>
              <li>
                <strong className="text-foreground">Profile data:</strong> Display name, handle,
                bio, and avatar (optional, provided by you)
              </li>
              <li>
                <strong className="text-foreground">Content:</strong> Outfit photos, wardrobe
                images, captions, and ratings you submit
              </li>
              <li>
                <strong className="text-foreground">Usage data:</strong> Pages visited, features
                used, and session activity (via Vercel Analytics)
              </li>
              <li>
                <strong className="text-foreground">Payment data:</strong> Processed entirely by
                Stripe — we never store card details
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your information to:</p>
            <ul>
              <li>Provide and improve the Fit Check service</li>
              <li>Send magic link authentication emails</li>
              <li>Process payments and manage subscriptions</li>
              <li>Generate AI style profiles based on your outfit data</li>
              <li>Display your public profile and outfits to other users</li>
              <li>Ensure platform safety and prevent abuse</li>
            </ul>
            <p>
              We do not sell your personal data to third parties. We do not use your data for
              targeted advertising.
            </p>
          </Section>

          <Section title="3. Public Content">
            <p>
              Outfit photos, ratings, and profile information you choose to share are visible to
              other users of the App. Ratings you give are anonymous — we do not display which
              user gave which rating.
            </p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We use the following third-party services:</p>
            <ul>
              <li>
                <strong className="text-foreground">Stripe</strong> — Payment processing. Governed
                by{' '}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  Stripe&apos;s Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Resend</strong> — Transactional email delivery
                (magic links)
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> — Hosting, analytics, and image
                storage
              </li>
              <li>
                <strong className="text-foreground">Neon</strong> — Database hosting (Postgres)
              </li>
              <li>
                <strong className="text-foreground">Anthropic Claude</strong> — AI style analysis
                (outfit data processed per Anthropic&apos;s privacy terms)
              </li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain your data for as long as your account is active. You may request deletion
              of your account and associated data at any time by emailing{' '}
              <a href="mailto:hello@fitcheckapp.com" className="text-gold hover:underline">
                hello@fitcheckapp.com
              </a>
              . Outfit photos stored in Vercel Blob will be deleted within 30 days of account
              removal.
            </p>
          </Section>

          <Section title="6. Security">
            <p>
              We implement industry-standard security measures including HTTPS encryption,
              httpOnly session cookies, and regular security audits. We do not store passwords.
              Authentication is handled via short-lived magic links.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              Fit Check is not directed at children under 13. We do not knowingly collect personal
              information from children under 13. If you believe a child under 13 has provided us
              information, please contact us immediately.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p>
              To exercise these rights, email{' '}
              <a href="mailto:hello@fitcheckapp.com" className="text-gold hover:underline">
                hello@fitcheckapp.com
              </a>
            </p>
          </Section>

          <Section title="9. Cookies">
            <p>
              We use a single session cookie (httpOnly, secure) to keep you logged in. We do not
              use third-party tracking cookies or advertising cookies.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant
              changes via email. Your continued use of the App after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              Privacy questions or requests:{' '}
              <a href="mailto:hello@fitcheckapp.com" className="text-gold hover:underline">
                hello@fitcheckapp.com
              </a>
            </p>
            <p>
              Read our{' '}
              <Link href="/terms" className="text-gold hover:underline">
                Terms of Service
              </Link>{' '}
              for additional policies.
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
      <div className="space-y-3 text-sm text-muted leading-relaxed [&_a]:text-gold [&_a:hover]:underline [&_ul]:ml-4 [&_ul]:mt-2 [&_ul]:space-y-1 [&_ul]:list-disc [&_strong]:font-semibold">
        {children}
      </div>
    </div>
  )
}
