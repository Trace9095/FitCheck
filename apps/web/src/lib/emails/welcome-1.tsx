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

interface Welcome1Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
}

export const subject = 'Welcome to Fit Check — rate your fit, own your style'

export default function Welcome1({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
}: Welcome1Props) {
  return (
    <Html>
      <Head />
      <Preview>Rate your fit. Own your style.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>
            Hi {name}, your style journey starts now.
          </Text>
          <Text style={styles.bodyText}>
            Welcome to Fit Check — the app where you post your outfits, get
            honest ratings from the community, and track your style evolution
            over time.
          </Text>
          <Text style={styles.bodyText}>
            Here&apos;s how to get started in three steps:
          </Text>
          <Text style={styles.bodyText}>
            1. Post your first fit — a photo and optional tags (streetwear,
            formal, casual, etc.)
            <br />
            2. Get your first rating from the community (1–10 on Originality,
            Execution, and Confidence)
            <br />
            3. See your Style Score — your rolling average across all fits
          </Text>
          <Text style={styles.bodyText}>
            Your first fit is waiting. Don&apos;t make us wait.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button href={`${appUrl}/upload`} style={styles.button}>
              Post Your First Fit
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
