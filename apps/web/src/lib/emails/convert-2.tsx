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

interface Convert2Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
  offerCode?: string
}

export const subject = 'Flash sale: 40% off Fit Check Pro — today only'

export default function Convert2({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
  offerCode = 'CHECK40',
}: Convert2Props) {
  return (
    <Html>
      <Head />
      <Preview>40% off Fit Check Pro — today only.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>40% off — today only</Text>
          <Text style={styles.bodyText}>Hey {name}.</Text>
          <Text style={styles.bodyText}>
            For the next 24 hours, you can get Fit Check Pro at 40% off with
            code <strong style={{ color: '#D4A853' }}>{offerCode}</strong>.
            No extensions. No exceptions. Today only.
          </Text>
          <Text style={styles.bodyText}>
            Pro gives you AI style scoring on every outfit you post — a deep
            breakdown of color theory, proportion, texture, and confidence.
            Not a generic score. Specific to your fit.
          </Text>
          <Text style={styles.bodyText}>
            The users who improve fastest on Fit Check are Pro users. They know
            exactly what&apos;s working and what&apos;s not, down to the color
            palette. Your AI style analysis could be running by tonight.
          </Text>
          <Text style={styles.bodyText}>
            Use code <strong style={{ color: '#D4A853' }}>{offerCode}</strong>{' '}
            at checkout. 40% off. Today only.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button
              href={`${appUrl}/upgrade?code=${offerCode}`}
              style={styles.button}
            >
              Claim 40% Off
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
