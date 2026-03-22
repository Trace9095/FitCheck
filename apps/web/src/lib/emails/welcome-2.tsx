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

interface Welcome2Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
}

export const subject = 'Your Fit Feed is ready — here\'s how it works'

export default function Welcome2({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
}: Welcome2Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Fit Feed is live. Here&apos;s what to do next.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>Your Fit Feed is live.</Text>
          <Text style={styles.bodyText}>
            Hey {name}, here&apos;s how the core feed works.
          </Text>
          <Text style={styles.bodyText}>
            When you post a fit, the community rates it 1–10 across three
            dimensions: Originality, Execution, and Confidence. Your Style
            Score is your rolling average across all of them.
          </Text>
          <Text style={styles.bodyText}>
            You can filter your feed by aesthetic — streetwear, formal, casual,
            and more. Browse what&apos;s trending or sort by highest-rated fits
            in your preferred categories.
          </Text>
          <Text style={styles.bodyText}>
            You can also rate other people&apos;s fits and build a reputation as
            a respected judge. The community takes ratings seriously — honest
            feedback is what drives improvement.
          </Text>
          <Text style={styles.bodyText}>
            The best stylists on Fit Check are the ones who rate generously and
            post consistently.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button href={`${appUrl}/feed`} style={styles.button}>
              Open Your Feed
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
