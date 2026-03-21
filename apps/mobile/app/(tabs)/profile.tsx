import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native'
import { apiGet, apiPost } from '../../lib/api'
import { clearSession, getStoredSession } from '../../lib/storage'
import { router } from 'expo-router'

const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  gold: '#D4A853',
  text: '#E6EDF3',
  muted: '#8B949E',
}

interface ProfileData {
  id: string
  handle: string
  name?: string
  avatarUrl?: string
  bio?: string
  tier: 'free' | 'pro' | 'stylist'
  outfits: Array<{
    id: string
    imageUrl: string
    avgRating: number
    ratingCount: number
    category: string
  }>
  styleProfile?: {
    aesthetic: string
    colorPalette: string[]
    signaturePieces: string[]
    outfitCount: number
  }
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  async function load(isRefresh = false) {
    try {
      const session = await getStoredSession()
      if (!session) { router.replace('/(auth)/login'); return }
      // Use /api/profile/me endpoint (returns own profile)
      const res = await apiGet<{ data: ProfileData }>('/api/profile/me')
      setProfile(res.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const onRefresh = useCallback(() => { setRefreshing(true); load(true) }, [])

  async function handleAnalyze() {
    setAnalyzing(true)
    try {
      await apiPost('/api/style/analyze', {})
      await load()
      Alert.alert('Style profile updated!', 'Your AI analysis is ready.')
    } catch (err: any) {
      Alert.alert(
        'Stylist feature',
        'AI style analysis is available on the Stylist plan ($4.99 one-time). Upgrade at fitcheckapp.com/pricing'
      )
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleLogout() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await clearSession()
          try { await apiPost('/api/auth/logout', {}) } catch {}
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    )
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Could not load profile</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => load()} activeOpacity={0.8}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const tierBadgeColor = profile.tier === 'stylist' ? COLORS.gold : profile.tier === 'pro' ? '#A78BFA' : COLORS.muted

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {(profile.handle?.[0] ?? '?').toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.handle}>@{profile.handle}</Text>
        {profile.name ? <Text style={styles.name}>{profile.name}</Text> : null}
        {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
        <View style={[styles.tierBadge, { borderColor: tierBadgeColor }]}>
          <Text style={[styles.tierText, { color: tierBadgeColor }]}>
            {profile.tier.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{profile.outfits.length}</Text>
          <Text style={styles.statLabel}>Fits</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>
            {profile.outfits.length > 0
              ? (profile.outfits.reduce((s, o) => s + o.avgRating, 0) / profile.outfits.length).toFixed(1)
              : '--'}
          </Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>
            {profile.outfits.reduce((s, o) => s + o.ratingCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Ratings</Text>
        </View>
      </View>

      {/* Style Profile */}
      {profile.styleProfile ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Style Profile</Text>
          <View style={styles.styleCard}>
            <Text style={styles.styleAesthetic}>{profile.styleProfile.aesthetic}</Text>
            {profile.styleProfile.colorPalette.length > 0 && (
              <>
                <Text style={styles.styleSubLabel}>Color Palette</Text>
                <View style={styles.tagRow}>
                  {profile.styleProfile.colorPalette.map((c) => (
                    <View key={c} style={styles.tag}><Text style={styles.tagText}>{c}</Text></View>
                  ))}
                </View>
              </>
            )}
            {profile.styleProfile.signaturePieces.length > 0 && (
              <>
                <Text style={styles.styleSubLabel}>Signature Pieces</Text>
                <View style={styles.tagRow}>
                  {profile.styleProfile.signaturePieces.map((p) => (
                    <View key={p} style={[styles.tag, styles.tagGold]}><Text style={[styles.tagText, styles.tagTextGold]}>{p}</Text></View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.analyzeBtn}
          onPress={handleAnalyze}
          disabled={analyzing}
          activeOpacity={0.85}
        >
          {analyzing ? (
            <ActivityIndicator color={COLORS.bg} size="small" />
          ) : (
            <>
              <Text style={styles.analyzeBtnTitle}>Generate AI Style Profile</Text>
              <Text style={styles.analyzeBtnSub}>Stylist plan required</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Outfit grid */}
      {profile.outfits.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Fits</Text>
          <View style={styles.grid}>
            {profile.outfits.map((outfit) => (
              <View key={outfit.id} style={styles.gridCard}>
                <Image source={{ uri: outfit.imageUrl }} style={styles.gridImg} resizeMode="cover" />
                <Text style={styles.gridRating}>
                  {outfit.avgRating > 0 ? outfit.avgRating.toFixed(1) : '--'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutBtnText}>Sign out</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingTop: 28, paddingHorizontal: 20, paddingBottom: 20 },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 32, fontWeight: '700', color: COLORS.bg },
  handle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  name: { fontSize: 15, color: COLORS.muted, marginBottom: 6 },
  bio: { fontSize: 14, color: COLORS.muted, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tierText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    marginBottom: 20,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  styleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  styleAesthetic: { fontSize: 17, fontWeight: '700', color: COLORS.gold, marginBottom: 12 },
  styleSubLabel: { fontSize: 12, fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border },
  tagGold: { borderColor: COLORS.gold },
  tagText: { fontSize: 12, color: COLORS.text },
  tagTextGold: { color: COLORS.gold },
  analyzeBtn: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
    minHeight: 72,
    justifyContent: 'center',
  },
  analyzeBtnTitle: { fontSize: 15, fontWeight: '700', color: COLORS.gold, marginBottom: 2 },
  analyzeBtnSub: { fontSize: 12, color: COLORS.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  gridCard: { width: '31.5%', position: 'relative' },
  gridImg: { width: '100%', aspectRatio: 3 / 4, borderRadius: 8 },
  gridRating: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
    backgroundColor: 'rgba(13,17,23,0.8)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginBottom: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  logoutBtnText: { color: COLORS.muted, fontSize: 15, fontWeight: '600' },
  spacer: { height: 20 },
  errorText: { fontSize: 16, color: COLORS.muted, marginBottom: 16 },
  retryBtn: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnText: { color: COLORS.text, fontWeight: '600' },
})
