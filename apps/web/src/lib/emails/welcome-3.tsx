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

interface Welcome3Props {
  name?: string
  appUrl?: string
  unsubscribeUrl?: string
}

export const subject = 'How Marcus became a style icon on Fit Check'

export default function Welcome3({
  name = 'there',
  appUrl = 'https://fitcheck.app',
  unsubscribeUrl = 'https://fitcheck.app/unsubscribe',
}: Welcome3Props) {
  return (
    <Html>
      <Head />
      <Preview>How Marcus became the most-followed stylist in his city.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.appName}>Fit Check</Text>
          <Text style={styles.heading}>
            From zero followers to 4,200 in 90 days
          </Text>
          <Text style={styles.bodyText}>Hey {name}.</Text>
          <Text style={styles.bodyText}>
            When Marcus joined Fit Check, he had no following and — by his own
            admission — mediocre fits. He was dressing the way he thought was
            cool, not the way the community actually responded to.
          </Text>
          <Text style={styles.bodyText}>
            That changed when he started paying attention to his ratings. Instead
            of posting and moving on, he used Fit Check&apos;s feedback to
            understand exactly what was landing and what wasn&apos;t. He
            iterated on his style every week, doubling down on what scored well
            and cutting what didn&apos;t.
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
            &ldquo;The ratings hurt at first. But they were right. I stopped
            wearing what I thought was cool and started wearing what actually
            worked. My style completely changed.&rdquo;
          </Text>
          <Text style={styles.bodyText}>
            Ninety days later, Marcus had 4,200 followers, a Style Score in the
            top 5% of the platform, and a wardrobe he was genuinely proud of.
          </Text>
          <Text style={styles.bodyText}>
            The data was there the whole time. He just needed to use it.
          </Text>
          <Section style={{ margin: '32px 0' }}>
            <Button href={`${appUrl}/upload`} style={styles.button}>
              Post Your Next Fit
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
