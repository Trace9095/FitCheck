import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { styles } from './base'

interface Reengage3Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
  offerCode?: string
}

export const subject = 'Come back — your first month of Pro is on us'

export default function Reengage3({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
  offerCode = 'FITBACK',
}: Reengage3Props) {
  return (
    <Html>
      <Head />
      <Preview>One month free Pro — come back and level up.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>We want you back, {name}.</Text>
          <Text style={styles.bodyText}>
            It&apos;s been 30 days. We noticed.
          </Text>
          <Text style={styles.bodyText}>
            We&apos;re offering your first month of Fit Check Pro free — no
            credit card required. Use code{' '}
            <strong style={{ color: '#D4A853' }}>{offerCode}</strong> when you
            come back.
          </Text>
          <Text style={styles.bodyText}>
            After a month, decide if it&apos;s worth it. If not, you keep the
            free plan with no hassle. But we think once you see the AI style
            feedback on your fits, you&apos;ll understand why Pro users stay.
          </Text>
          <Text style={styles.bodyText}>
            We think your style deserves better data. Come get it.
          </Text>
          <Text style={styles.bodyText}>
            Code <strong style={{ color: '#D4A853' }}>{offerCode}</strong>.
            First month free. No credit card needed.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button
              href={`${appUrl}/dashboard?code=${offerCode}`}
              style={styles.button}
            >
              Claim Your Free Month
            </Button>
          </Section>
          <Hr style={styles.hr} />
          <Text style={styles.footerText}>
            Fit Check — fitcheck.app.{' '}
            <Link href={unsubscribeUrl} style={styles.footerLink}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
