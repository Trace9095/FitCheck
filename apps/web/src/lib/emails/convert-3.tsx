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

interface Convert3Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
  offerCode?: string
}

export const subject = 'Tonight\'s your last chance — 40% off Fit Check Pro'

export default function Convert3({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
  offerCode = 'CHECK40',
}: Convert3Props) {
  return (
    <Html>
      <Head />
      <Preview>Your 40% discount expires tonight.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>Tonight&apos;s your last chance</Text>
          <Text style={styles.bodyText}>Hey {name}.</Text>
          <Text style={styles.bodyText}>
            Your 40% off code{' '}
            <strong style={{ color: '#D4A853' }}>{offerCode}</strong> expires
            tonight at midnight. After that, Pro is back to full price.
          </Text>
          <Text
            style={{
              ...styles.bodyText,
              borderLeft: '3px solid #D4A853',
              paddingLeft: '16px',
              fontStyle: 'italic',
              color: '#E6EDF3',
            }}
          >
            &ldquo;The AI scoring told me I was overcomplicating my fits. Too
            many pieces, too many colors. I scaled back, kept it clean, and my
            score jumped from a 6.2 to an 8.1 in three weeks.&rdquo;
            <br />
            <span style={{ color: '#8B949E', fontStyle: 'normal', fontSize: '13px' }}>
              — Ava K., Fit Check Pro user
            </span>
          </Text>
          <Text style={styles.bodyText}>
            That kind of clarity is what Pro gives you. Not just a community
            score — actual feedback on what to change and why.
          </Text>
          <Text style={styles.bodyText}>
            Code <strong style={{ color: '#D4A853' }}>{offerCode}</strong>.
            40% off. Expires at midnight tonight.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button
              href={`${appUrl}/upgrade?code=${offerCode}`}
              style={styles.button}
            >
              Upgrade Before Midnight
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
