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

interface Welcome5Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
}

export const subject = 'Two weeks in — has your style score improved?'

export default function Welcome5({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
}: Welcome5Props) {
  return (
    <Html>
      <Head />
      <Preview>Two weeks in — how&apos;s your style game?</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>
            Two weeks with Fit Check, {name}.
          </Text>
          <Text style={styles.bodyText}>
            By now you should have a baseline Style Score — a number that tells
            you exactly where you stand with the community.
          </Text>
          <Text style={styles.bodyText}>
            Here&apos;s what we&apos;ve seen: the users who improve fastest are
            the ones who post at least 3 times per week and actively rate others.
            Consistent posting gives the community more signal. Rating others
            builds your reputation and keeps your eye sharp.
          </Text>
          <Text style={styles.bodyText}>
            If you haven&apos;t posted yet — no judgment. Now&apos;s the time.
            Even an everyday look counts. The community doesn&apos;t expect
            perfection. They expect authenticity.
          </Text>
          <Text style={styles.bodyText}>
            And if you want to go deeper than community ratings, Fit Check Pro
            gives you AI-powered style feedback on every outfit you post — color
            theory, proportion, texture, and more. A lot of users say it
            changed how they think about getting dressed.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button href={`${appUrl}/upgrade`} style={styles.button}>
              Upgrade to Pro
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
