import { track } from '@vercel/analytics'

// SaaS app analytics — dual pipeline: Vercel Analytics + GA4
//
// GA4 Event Naming Convention (snake_case, max 40 chars):
//   signup_complete       — user account created
//   subscription_start    — checkout initiated for pro/stylist
//   subscription_complete — payment confirmed (Stripe webhook)
//   feature_use           — key feature interaction
//   content_create        — user-generated content posted
//   content_view          — content detail viewed
//   content_share         — content shared externally
//   onboarding_step       — onboarding milestone reached
//   upgrade_prompt_view   — paywall/upgrade prompt shown
//   cta_click             — call-to-action clicked
//   form_submit           — form successfully submitted
//   scroll_depth          — scroll milestone reached
//   page_engagement       — time-on-page milestone

function gaEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (gtag) {
    gtag('event', eventName, params)
  }
}

export function trackSignupComplete(method: string) {
  track('signup_complete', { method })
  gaEvent('sign_up', { method })
}

export function trackSubscriptionStart(planName: string, value: number) {
  track('subscription_start', { plan: planName, value: String(value) })
  gaEvent('begin_checkout', {
    value,
    currency: 'USD',
    items: [{ item_name: planName, price: value, quantity: 1 }],
  })
}

export function trackSubscriptionComplete(planName: string, value: number, transactionId: string) {
  track('subscription_complete', { plan: planName, value: String(value) })
  gaEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency: 'USD',
    items: [{ item_name: planName, price: value, quantity: 1 }],
  })
}

export function trackFeatureUse(featureName: string, details?: string) {
  track('feature_use', { feature: featureName, details: details || '' })
  gaEvent('feature_use', { feature_name: featureName, feature_detail: details || '' })
}

export function trackContentCreate(contentType: string, contentId?: string) {
  track('content_create', { type: contentType, id: contentId || '' })
  gaEvent('content_create', { content_type: contentType, content_id: contentId || '' })
}

export function trackContentView(contentType: string, contentId: string) {
  track('content_view', { type: contentType, id: contentId })
  gaEvent('view_item', { item_id: contentId, item_category: contentType })
}

export function trackContentShare(contentType: string, method: string) {
  track('content_share', { type: contentType, method })
  gaEvent('share', { content_type: contentType, method })
}

export function trackOnboardingStep(step: number, stepName: string) {
  track('onboarding_step', { step: String(step), name: stepName })
  gaEvent('onboarding_step', { step_number: step, step_name: stepName })
}

export function trackUpgradePromptView(source: string) {
  track('upgrade_prompt_view', { source })
  gaEvent('upgrade_prompt_view', { prompt_source: source })
}

export function trackCTA(name: string, props?: Record<string, string>) {
  track('cta_click', { name, ...props })
  gaEvent('cta_click', { cta_name: name, cta_source: props?.source || 'unknown' })
}

export function trackFormSubmit(formName: string) {
  track('form_submit', { form: formName })
  gaEvent('form_submit', { form_name: formName })
}

export function trackExternalLink(name: string, url: string) {
  track('external_link', { name, url })
  gaEvent('external_link', { link_name: name, link_url: url })
}

export function trackScrollDepth(depth: number, page: string) {
  track('scroll_depth', { depth: String(depth), page })
  gaEvent('scroll_depth', { scroll_percentage: depth, page_path: page })
}

export function trackPageEngagement(page: string, timeOnPage: number) {
  track('page_engagement', { page, seconds: String(timeOnPage) })
  gaEvent('page_engagement', { page_path: page, engagement_time: timeOnPage })
}
