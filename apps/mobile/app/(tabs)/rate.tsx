import { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { apiGet, apiPost } from '../../lib/api'

const { width: SCREEN_W } = Dimensions.get('window')
const CARD_W = SCREEN_W - 40
const SWIPE_THRESHOLD = 80

const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  gold: '#D4A853',
  text: '#E6EDF3',
  muted: '#8B949E',
  fit: '#22C55E',
  miss: '#EF4444',
}

interface SwipeOutfit {
  id: string
  userHandle?: string
  imageUrl: string
  caption?: string
  category: string
}

export default function RateScreen() {
  const [outfits, setOutfits] = useState<SwipeOutfit[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<'swipe' | 'score'>('swipe')
  const [direction, setDirection] = useState<'fit' | 'miss' | null>(null)
  const [score, setScore] = useState(7)
  const [done, setDone] = useState(false)

  const pan = useRef(new Animated.ValueXY()).current
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
  })
  const fitOpacity = pan.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1] })
  const missOpacity = pan.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0] })

  useEffect(() => { fetchOutfits() }, [])

  async function fetchOutfits() {
    setLoading(true)
    try {
      const res = await apiGet<{ data: { items: SwipeOutfit[] } }>('/api/feed/swipe')
      setOutfits(res.data.items)
      setIndex(0)
      setDone(false)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          swipeOut('fit')
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          swipeOut('miss')
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()
        }
      },
    })
  ).current

  function swipeOut(dir: 'fit' | 'miss') {
    setDirection(dir)
    const toX = dir === 'fit' ? SCREEN_W * 1.5 : -SCREEN_W * 1.5
    setScore(dir === 'fit' ? 8 : 3)
    Animated.timing(pan, {
      toValue: { x: toX, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 })
      setPhase('score')
    })
  }

  async function submitScore() {
    const outfit = outfits[index]
    if (!outfit) return
    try {
      await apiPost(`/api/outfits/${outfit.id}/rate`, { score })
    } catch {
      // silent
    }
    const next = index + 1
    if (next >= outfits.length) {
      setDone(true)
    } else {
      setIndex(next)
      setPhase('swipe')
      setDirection(null)
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    )
  }

  if (done || outfits.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.doneTitle}>All caught up!</Text>
        <Text style={styles.doneBody}>You&apos;ve rated all the fits for now.</Text>
        <TouchableOpacity style={styles.reloadBtn} onPress={fetchOutfits} activeOpacity={0.8}>
          <Text style={styles.reloadBtnText}>Load more fits</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const outfit = outfits[index]

  if (phase === 'score') {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.scoreTitle}>
          {direction === 'fit' ? '✓ Fit!' : '✗ Miss'}
        </Text>
        <Text style={styles.scoreSubtitle}>Give it a precise score</Text>

        <Image source={{ uri: outfit.imageUrl }} style={styles.scoreThumb} />

        <View style={styles.scoreRow}>
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <TouchableOpacity
              key={n}
              style={[
                styles.scoreBtn,
                score === n && styles.scoreBtnActive,
                n <= 5 && styles.scoreMissRange,
                n > 5 && n === score && styles.scoreFitActive,
              ]}
              onPress={() => setScore(n)}
              activeOpacity={0.75}
            >
              <Text style={[styles.scoreBtnText, score === n && styles.scoreBtnTextActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={submitScore} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>Submit Rating</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Swipe right = Fit  •  Swipe left = Miss</Text>

      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Stamps */}
        <Animated.View style={[styles.stamp, styles.fitStamp, { opacity: fitOpacity }]}>
          <Text style={styles.stampText}>FIT</Text>
        </Animated.View>
        <Animated.View style={[styles.stamp, styles.missStamp, { opacity: missOpacity }]}>
          <Text style={styles.stampText}>MISS</Text>
        </Animated.View>

        <Image source={{ uri: outfit.imageUrl }} style={styles.cardImage} resizeMode="cover" />

        <View style={styles.cardInfo}>
          <Text style={styles.cardHandle}>@{outfit.userHandle ?? 'user'}</Text>
          <View style={styles.cardCatBadge}>
            <Text style={styles.cardCatText}>{outfit.category}</Text>
          </View>
        </View>
        {outfit.caption ? (
          <Text style={styles.cardCaption} numberOfLines={2}>{outfit.caption}</Text>
        ) : null}
      </Animated.View>

      {/* Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.missBtn]}
          onPress={() => swipeOut('miss')}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>✗ Miss</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.fitBtn]}
          onPress={() => swipeOut('fit')}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>✓ Fit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center' },
  center: { justifyContent: 'center' },
  instructions: {
    marginTop: 16,
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 12,
  },
  card: {
    width: CARD_W,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  cardImage: { width: '100%', aspectRatio: 3 / 4 },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  cardHandle: { fontSize: 14, fontWeight: '600', color: COLORS.text, flex: 1 },
  cardCatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: COLORS.bg,
    borderRadius: 6,
  },
  cardCatText: { fontSize: 11, color: COLORS.muted, fontWeight: '600' },
  cardCaption: { fontSize: 13, color: COLORS.muted, paddingHorizontal: 14, paddingBottom: 12, lineHeight: 18 },
  stamp: {
    position: 'absolute',
    top: 32,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
  },
  fitStamp: { right: 20, borderColor: COLORS.fit, transform: [{ rotate: '15deg' }] },
  missStamp: { left: 20, borderColor: COLORS.miss, transform: [{ rotate: '-15deg' }] },
  stampText: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  btnRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  missBtn: { backgroundColor: '#3A1F1F', borderWidth: 1, borderColor: COLORS.miss },
  fitBtn: { backgroundColor: '#1A3A1F', borderWidth: 1, borderColor: COLORS.fit },
  actionBtnText: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  // Score screen
  doneTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  doneBody: { fontSize: 15, color: COLORS.muted, marginBottom: 32, textAlign: 'center' },
  reloadBtn: {
    height: 52,
    paddingHorizontal: 32,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reloadBtnText: { color: COLORS.bg, fontSize: 16, fontWeight: '700' },
  scoreTitle: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  scoreSubtitle: { fontSize: 14, color: COLORS.muted, marginBottom: 20 },
  scoreThumb: {
    width: CARD_W * 0.55,
    aspectRatio: 3 / 4,
    borderRadius: 14,
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  scoreBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreMissRange: { borderColor: '#3A1F1F' },
  scoreBtnActive: { backgroundColor: COLORS.miss, borderColor: COLORS.miss },
  scoreFitActive: { backgroundColor: COLORS.fit, borderColor: COLORS.fit },
  scoreBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.muted },
  scoreBtnTextActive: { color: COLORS.text },
  submitBtn: {
    height: 52,
    paddingHorizontal: 40,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  submitBtnText: { color: COLORS.bg, fontSize: 16, fontWeight: '700' },
})
