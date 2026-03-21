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
} from 'react-native'
import { apiGet } from '../../lib/api'

const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  gold: '#D4A853',
  text: '#E6EDF3',
  muted: '#8B949E',
}

const CATEGORIES = ['All', 'Streetwear', 'Business', 'Casual', 'DateNight', 'Festival', 'Gym']

interface OutfitItem {
  id: string
  userHandle?: string
  imageUrl: string
  caption?: string
  category: string
  avgRating: number
  ratingCount: number
  createdAt: string
}

export default function FeedScreen() {
  const [outfits, setOutfits] = useState<OutfitItem[]>([])
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function loadFeed(reset = false) {
    const p = reset ? 1 : page
    const cat = category === 'All' ? '' : category
    try {
      const res = await apiGet<{ data: { items: OutfitItem[]; hasMore: boolean } }>(
        `/api/outfits?page=${p}${cat ? `&category=${cat}` : ''}`
      )
      if (reset) {
        setOutfits(res.data.items)
        setPage(2)
      } else {
        setOutfits((prev) => [...prev, ...res.data.items])
        setPage((prev) => prev + 1)
      }
      setHasMore(res.data.hasMore)
    } catch {
      // Silent fail — show stale data
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    setPage(1)
    loadFeed(true)
  }, [category])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadFeed(true)
  }, [category])

  function renderItem({ item }: { item: OutfitItem }) {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardFooter}>
          <Text style={styles.handle}>@{item.userHandle ?? 'user'}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>
              {item.avgRating > 0 ? item.avgRating.toFixed(1) : '--'}
            </Text>
            <Text style={styles.ratingMuted}> / 10</Text>
          </View>
        </View>
        {item.caption ? (
          <Text style={styles.caption} numberOfLines={2}>
            {item.caption}
          </Text>
        ) : null}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Category filter */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, category === cat && styles.filterChipActive]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterChipText, category === cat && styles.filterChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.gold} size="large" />
        </View>
      ) : (
        <FlatList
          data={outfits}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.gold}
            />
          }
          onEndReached={() => { if (hasMore) loadFeed() }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={COLORS.muted} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No fits yet</Text>
              <Text style={styles.emptyBody}>Be the first to post in this category.</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterBar: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterScroll: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  filterChipTextActive: { color: COLORS.bg },
  listContent: { padding: 8 },
  row: { justifyContent: 'space-between' },
  card: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', aspectRatio: 3 / 4 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  handle: { fontSize: 12, color: COLORS.muted, fontWeight: '600', flex: 1 },
  ratingBadge: { flexDirection: 'row', alignItems: 'baseline' },
  ratingText: { fontSize: 14, fontWeight: '700', color: COLORS.gold },
  ratingMuted: { fontSize: 11, color: COLORS.muted },
  caption: { fontSize: 12, color: COLORS.muted, paddingHorizontal: 8, paddingTop: 4, lineHeight: 16 },
  categoryBadge: {
    margin: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: COLORS.bg,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryText: { fontSize: 11, color: COLORS.muted, fontWeight: '600' },
  footerLoader: { paddingVertical: 16, alignItems: 'center' },
  empty: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptyBody: { fontSize: 14, color: COLORS.muted, textAlign: 'center' },
})
