/**
 * season.ts — Seasonal CTA logic
 *
 * Each project has its own season window. Configure START_MONTH/END_MONTH for yours.
 * All dates use America/Denver timezone.
 *
 * Usage in React components (client-side only, for hydration safety):
 *
 *   const [inSeason, setInSeason] = useState(false)
 *   useEffect(() => { setInSeason(isInSeason()) }, [])
 */

const DENVER_TZ = 'America/Denver'

function nowInDenver(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: DENVER_TZ }))
}

// ─── Configure your season window ─────────────────────────────────────────
// Month is 0-indexed (0 = January, 11 = December)
const SEASON_START = { month: 3, day: 15 }  // April 15
const SEASON_END   = { month: 8, day: 30 }  // September 30
// ──────────────────────────────────────────────────────────────────────────

export function isInSeason(now = nowInDenver()): boolean {
  const month = now.getMonth()
  const day = now.getDate()

  const afterStart =
    month > SEASON_START.month ||
    (month === SEASON_START.month && day >= SEASON_START.day)

  const beforeEnd =
    month < SEASON_END.month ||
    (month === SEASON_END.month && day <= SEASON_END.day)

  return afterStart && beforeEnd
}

export function isOffSeason(now = nowInDenver()): boolean {
  return !isInSeason(now)
}

export function getSeasonalCTA(): { label: string; href: string } {
  if (isInSeason()) {
    return { label: 'Book Now', href: '/book' }
  }
  return { label: 'View Trip Details', href: '/trips' }
}

// ─── WWBG-specific helpers ────────────────────────────────────────────────
// Opening day is FRIDAY April 17 — NOT Thursday (CEO directive S118)

export function isWWBGOpen(now = nowInDenver()): boolean {
  const year = now.getFullYear()
  // WWBG: April 17 – October 31 (Denver time)
  const openStart = new Date(year, 3, 17)   // April 17
  const openEnd   = new Date(year, 9, 31, 23, 59, 59) // October 31
  return now >= openStart && now <= openEnd
}

// ─── RT-specific helpers ──────────────────────────────────────────────────
// RT has NO happy hour. Named daily specials only. (CEO directive, enforced)

export function getRTDailySpecial(now = nowInDenver()): string | null {
  const day = now.getDay() // 0=Sun, 1=Mon, ...
  const specials: Record<number, string> = {
    1: 'Margarita Monday',
    2: 'Taco Tuesday',
    3: 'Wine Wednesday',
    4: 'Thirsty Thursday',
    5: 'Friday Happy Hour', // Note: This is a daily named special, NOT "happy hour"
    6: 'Saturday Brunch',
    0: 'Sunday Funday',
  }
  return specials[day] ?? null
}
