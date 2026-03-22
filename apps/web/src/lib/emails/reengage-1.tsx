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

interface Reengage1Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
}

export const subject = "We noticed you've been away — come check your style"

export default function Reengage1({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
}: Reengage1Props) {
  return (
    <Html>
      <Head />
      <Preview>Your style hasn&apos;t been checked lately.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>
            Hey {name} — we noticed you&apos;ve been away.
          </Text>
          <Text style={styles.bodyText}>
            No new fits in the past week. The Fit Check community is active and
            rating — and your feed has been quiet.
          </Text>
          <Text style={styles.bodyText}>
            A few things that dropped while you were out:
          </Text>
          <Text style={styles.bodyText}>
            New aesthetic filters — filter your feed and profile by vibe more
            precisely than ever.
          </Text>
          <Text style={styles.bodyText}>
            Improved AI scoring accuracy — Pro users are seeing more detailed
            breakdowns on proportion and color.
          </Text>
          <Text style={styles.bodyText}>
            Collab ratings — rate fits with a friend and compare your scores
            side by side.
          </Text>
          <Text style={styles.bodyText}>
            Come back and post something. Even a quick everyday look. The
            community doesn&apos;t judge the fit — they rate it.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button href={`${appUrl}/upload`} style={styles.button}>
              Post a Fit
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
