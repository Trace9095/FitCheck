export const styles = {
  body: {
    backgroundColor: '#0D1117',
    fontFamily: "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
    margin: '0',
    padding: '0',
  } as const,
  container: {
    maxWidth: '560px',
    margin: '0 auto',
    padding: '40px 20px',
  } as const,
  appName: {
    fontSize: '20px',
    fontWeight: '700' as const,
    color: '#D4A853',
    margin: '0 0 32px',
    letterSpacing: '-0.3px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700' as const,
    color: '#E6EDF3',
    margin: '0 0 16px',
    lineHeight: '1.3',
    letterSpacing: '-0.3px',
  },
  bodyText: {
    fontSize: '15px',
    color: '#8B949E',
    lineHeight: '1.7',
    margin: '0 0 20px',
  },
  button: {
    backgroundColor: '#D4A853',
    color: '#0D1117',
    padding: '13px 28px',
    borderRadius: '8px',
    fontWeight: '600' as const,
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  hr: {
    borderColor: '#21262D',
    margin: '40px 0 24px',
  },
  footerText: {
    fontSize: '12px',
    color: '#484F58',
    margin: '0',
    lineHeight: '1.5',
  },
  footerLink: {
    color: '#484F58',
    textDecoration: 'underline',
  },
}
