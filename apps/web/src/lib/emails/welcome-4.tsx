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

interface Welcome4Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
}

export const subject = 'Pro: AI style scoring + your complete outfit archive'

export default function Welcome4({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
}: Welcome4Props) {
  return (
    <Html>
      <Head />
      <Preview>AI style scoring is here — and it&apos;s honest.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>
            What Pro users know about their style
          </Text>
          <Text style={styles.bodyText}>Hey {name}.</Text>
          <Text style={styles.bodyText}>
            Fit Check Pro gives you a deeper look at what&apos;s actually
            happening with your style — not just community scores, but AI-driven
            analysis of every fit you post.
          </Text>
          <Text style={styles.bodyText}>
            Here&apos;s what you get:
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>AI Style Analysis</strong>
            {' '}— a breakdown of what&apos;s working in each fit: color theory,
            proportion, texture, seasonality. Not generic. Specific to your
            outfit.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Complete Outfit Archive</strong>
            {' '}— searchable, sortable by score, filterable by vibe. Every fit
            you&apos;ve ever posted, organized.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Style Trend Tracking</strong>
            {' '}— see how your average score has moved over time. Know exactly
            when you leveled up.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Collections</strong>
            {' '}— save favorite outfits and organize them into lookbooks.
          </Text>
          <Text style={styles.bodyText}>
            $4.99/month or $39/year. Less than a new accessory.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button href={`${appUrl}/upgrade`} style={styles.button}>
              See Pro Features
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
