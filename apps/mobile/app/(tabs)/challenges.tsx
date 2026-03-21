import { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { apiGet, apiPost } from '../../lib/api'

const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  gold: '#D4A853',
  text: '#E6EDF3',
  muted: '#8B949E',
  warn: '#F59E0B',
}

interface Challenge {
  id: string
  title: string
  description: string
  theme: string
  prizeDescription?: string
  startDate: string
  endDate: string
  isActive: boolean
  entryCount?: number
}

function daysLeft(end: string): number {
  const ms = new Date(end).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86400000))
}

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [entering, setEntering] = useState<string | null>(null)

  async function load(isRefresh = false) {
    try {
      const res = await apiGet<{ data: Challenge[] }>('/api/challenges')
      setChallenges(Array.isArray(res.data) ? res.data : [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  async function enterChallenge(challengeId: string) {
    setEntering(challengeId)
    try {
      await apiPost(`/api/challenges/${challengeId}/enter`, {})
      Alert.alert('Entered!', 'Post your outfit to submit your entry.')
    } catch (err: any) {
      Alert.alert('Could not enter', err?.message ?? 'Try again.')
    } finally {
      setEntering(null)
    }
  }

  function renderItem({ item }: { item: Challenge }) {
    const days = daysLeft(item.endDate)
    const ending = days <= 3

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.themeBadge}>
            <Text style={styles.themeText}>{item.theme}</Text>
          </View>
          {ending && (
            <View style={styles.endingBadge}>
              <Text style={styles.endingText}>Ending soon</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc} numberOfLines={3}>{item.description}</Text>

        {item.prizeDescription ? (
          <View style={styles.prizeRow}>
            <Text style={styles.prizeLabel}>Prize: </Text>
            <Text style={styles.prizeText}>{item.prizeDescription}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.stat}>{item.entryCount ?? 0} entries</Text>
            <Text style={styles.statSep}>•</Text>
            <Text style={[styles.stat, ending && styles.statWarn]}>
              {days} day{days !== 1 ? 's' : ''} left
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.enterBtn, entering === item.id && styles.enterBtnLoading]}
            onPress={() => enterChallenge(item.id)}
            disabled={entering === item.id}
            activeOpacity={0.85}
          >
            {entering === item.id ? (
              <ActivityIndicator color={COLORS.bg} size="small" />
            ) : (
              <Text style={styles.enterBtnText}>Enter</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(true) }}
            tintColor={COLORS.gold}
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Active Challenges</Text>
            <Text style={styles.listHeaderSub}>Post your outfit to enter</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No active challenges</Text>
            <Text style={styles.emptyBody}>Check back soon for new style themes.</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, gap: 12 },
  listHeader: { marginBottom: 8 },
  listHeaderTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  listHeaderSub: { fontSize: 14, color: COLORS.muted },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  themeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  themeText: { fontSize: 11, fontWeight: '700', color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 0.5 },
  endingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#3A2800',
    borderWidth: 1,
    borderColor: COLORS.warn,
  },
  endingText: { fontSize: 11, fontWeight: '600', color: COLORS.warn },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  desc: { fontSize: 14, color: COLORS.muted, lineHeight: 20, marginBottom: 10 },
  prizeRow: { flexDirection: 'row', marginBottom: 12 },
  prizeLabel: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  prizeText: { fontSize: 13, color: COLORS.gold, flex: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stat: { fontSize: 13, color: COLORS.muted },
  statSep: { fontSize: 13, color: COLORS.border },
  statWarn: { color: COLORS.warn },
  enterBtn: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 44,
  },
  enterBtnLoading: { opacity: 0.7 },
  enterBtnText: { color: COLORS.bg, fontSize: 14, fontWeight: '700' },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptyBody: { fontSize: 14, color: COLORS.muted, textAlign: 'center' },
})
