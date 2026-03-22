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

interface Convert1Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
}

export const subject = 'Everything Fit Check Pro gives you'

export default function Convert1({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
}: Convert1Props) {
  return (
    <Html>
      <Head />
      <Preview>AI scoring, outfit archive, style analytics — all in Pro.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>Here&apos;s what Pro gets you</Text>
          <Text style={styles.bodyText}>Hey {name}.</Text>
          <Text style={styles.bodyText}>
            Fit Check Pro is the full picture. Here&apos;s everything
            included:
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>AI Style Scoring</strong>
            {' '}— Deep analysis per outfit covering color theory, proportion,
            texture, and confidence. Not just a number — a real breakdown.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Complete Outfit Archive</strong>
            {' '}— Unlimited storage. Searchable. Every fit you&apos;ve ever
            posted, organized and sortable by score or date.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Style Trend Analytics</strong>
            {' '}— Your Style Score over time. See when you plateaued, when you
            improved, and what drove it.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Collections</strong>
            {' '}— Organize your best fits into lookbooks. Share them or keep
            them private.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Priority Community Placement</strong>
            {' '}— Your fits are surfaced to more people in the feed.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Ad-Free Experience</strong>
            {' '}— Just the fits. No distractions.
          </Text>
          <Text style={styles.bodyText}>
            $4.99/month or $39/year. Cancel anytime.
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
