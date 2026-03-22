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

interface Reengage2Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
}

export const subject = "You haven't checked your Style Analytics yet"

export default function Reengage2({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
}: Reengage2Props) {
  return (
    <Html>
      <Head />
      <Preview>Style Analytics — the one feature most people skip.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>Your Style Analytics are waiting.</Text>
          <Text style={styles.bodyText}>Hey {name}.</Text>
          <Text style={styles.bodyText}>
            Most people post and forget. The ones who actually improve check
            their analytics.
          </Text>
          <Text style={styles.bodyText}>
            Even on the free plan, you have access to a basic breakdown of your
            performance. Here&apos;s what&apos;s in there:
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Your highest-scoring fits</strong>
            {' '}— see which outfits resonated most with the community and why.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Tag performance</strong>
            {' '}— which aesthetics and tags correlate with better scores for
            you specifically.
          </Text>
          <Text style={styles.bodyText}>
            <strong style={{ color: '#E6EDF3' }}>Your best-performing aesthetic</strong>
            {' '}— the vibe category where you consistently score highest.
          </Text>
          <Text style={styles.bodyText}>
            It&apos;s the roadmap to a higher Style Score. Most users have never
            looked at it. That&apos;s an edge — if you use it.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button href={`${appUrl}/profile/analytics`} style={styles.button}>
              View Your Analytics
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
