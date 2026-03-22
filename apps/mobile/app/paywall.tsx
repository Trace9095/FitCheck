import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useRevenueCat } from '../lib/revenuecat'

type MockPackage = { identifier: string; packageType: string; product: { priceString: string } }
const PACKAGE_TYPE = { MONTHLY: 'MONTHLY', ANNUAL: 'ANNUAL', LIFETIME: 'LIFETIME' }

const APP_NAME = 'Fit Check Pro'
const FEATURES: string[] = [
  'Unlimited outfit saves',
  'AI style suggestions',
  'Wardrobe analytics',
  'Outfit calendar planner',
  'No ads',
]

const COLORS = {
  bg: '#0D1117', card: '#161B22', border: '#21262D',
  gold: '#D4A853', white: '#E6EDF3', muted: '#8B949E', dim: '#484F58', green: '#3FB950',
}

export default function PaywallScreen() {
  const { isPro, purchasePackage, restorePurchases } = useRevenueCat()
  const [packages] = useState<MockPackage[]>([
    { identifier: 'monthly', packageType: PACKAGE_TYPE.MONTHLY, product: { priceString: '$4.99/mo' } },
    { identifier: 'annual', packageType: PACKAGE_TYPE.ANNUAL, product: { priceString: '$29.99/yr' } },
    { identifier: 'lifetime', packageType: PACKAGE_TYPE.LIFETIME, product: { priceString: '$79.99' } },
  ])
  const [selected, setSelected] = useState<MockPackage | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    if (isPro) router.back()
    else setSelected(packages[1] ?? null)
  }, [isPro])

  const handlePurchase = async () => {
    if (!selected || purchasing) return
    setPurchasing(true)
    try {
      const success = await purchasePackage(selected)
      if (success) Alert.alert('Welcome to Pro!', 'All features unlocked.', [{ text: "Let's Go!", onPress: () => router.back() }])
    } catch (err: unknown) {
      Alert.alert('Purchase Failed', (err as { message?: string }).message ?? 'Please try again.')
    } finally { setPurchasing(false) }
  }

  const handleRestore = async () => {
    setRestoring(true)
    try {
      await restorePurchases()
      if (isPro) Alert.alert('Restored!', 'Pro restored.', [{ text: 'OK', onPress: () => router.back() }])
      else Alert.alert('No Subscription Found', 'No active Pro subscription found.')
    } catch { Alert.alert('Error', 'Could not restore purchases.') }
    finally { setRestoring(false) }
  }

  const getLabel = (pkg: MockPackage) => {
    switch (pkg.packageType) {
      case PACKAGE_TYPE.MONTHLY: return { title: 'Monthly', badge: null }
      case PACKAGE_TYPE.ANNUAL: return { title: 'Yearly', badge: 'MOST POPULAR' }
      case PACKAGE_TYPE.LIFETIME: return { title: 'Lifetime', badge: 'BEST VALUE' }
      default: return { title: pkg.identifier, badge: null }
    }
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Text style={s.heroTitle}>{APP_NAME}</Text>
          <Text style={s.heroSub}>Unlock the full experience</Text>
        </View>
        <View style={s.features}>
          {FEATURES.map((f) => (
            <View key={f} style={s.featureRow}>
              <Text style={s.checkmark}>✓</Text>
              <Text style={s.featureText}>{f}</Text>
            </View>
          ))}
        </View>
        <View style={s.packages}>
          {packages.map((pkg) => {
            const { title, badge } = getLabel(pkg)
            const isSelected = selected?.identifier === pkg.identifier
            return (
              <TouchableOpacity key={pkg.identifier} style={[s.pkgCard, isSelected && s.pkgCardSelected]} onPress={() => setSelected(pkg)} activeOpacity={0.8}>
                {badge && <View style={s.pkgBadge}><Text style={s.pkgBadgeText}>{badge}</Text></View>}
                <View style={s.pkgLeft}>
                  <Text style={[s.pkgTitle, isSelected && s.pkgTitleSelected]}>{title}</Text>
                  <Text style={s.pkgPrice}>{pkg.product.priceString}</Text>
                </View>
                <View style={[s.pkgRadio, isSelected && s.pkgRadioSelected]} />
              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity style={[s.ctaBtn, (purchasing || !selected) && s.ctaBtnDisabled]} onPress={handlePurchase} disabled={purchasing || !selected} activeOpacity={0.85}>
          {purchasing ? <ActivityIndicator color={COLORS.bg} /> : <Text style={s.ctaBtnText}>{selected ? `Subscribe · ${selected.product.priceString}` : 'Select a Plan'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={s.restoreBtn} onPress={handleRestore} disabled={restoring} activeOpacity={0.7}>
          <Text style={s.restoreText}>{restoring ? 'Restoring…' : 'Restore Purchases'}</Text>
        </TouchableOpacity>
        <Text style={s.legal}>Subscriptions auto-renew unless cancelled 24h before renewal. Manage in App Store Settings.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 24, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 28 },
  heroTitle: { fontSize: 26, fontWeight: '900', color: COLORS.white, textAlign: 'center', marginBottom: 6 },
  heroSub: { fontSize: 15, color: COLORS.muted },
  features: { marginBottom: 28, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  checkmark: { fontSize: 18, color: COLORS.green, width: 24 },
  featureText: { flex: 1, fontSize: 15, color: COLORS.white, fontWeight: '500' },
  packages: { gap: 10, marginBottom: 24 },
  pkgCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: COLORS.border, minHeight: 64, position: 'relative', overflow: 'hidden' },
  pkgCardSelected: { borderColor: COLORS.gold },
  pkgBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.gold, borderBottomLeftRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  pkgBadgeText: { fontSize: 9, fontWeight: '800', color: COLORS.bg, letterSpacing: 0.5 },
  pkgLeft: { flex: 1 },
  pkgTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white, marginBottom: 2 },
  pkgTitleSelected: { color: COLORS.gold },
  pkgPrice: { fontSize: 14, color: COLORS.muted },
  pkgRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.dim },
  pkgRadioSelected: { borderColor: COLORS.gold, backgroundColor: COLORS.gold },
  ctaBtn: { backgroundColor: COLORS.gold, borderRadius: 16, paddingVertical: 18, alignItems: 'center', minHeight: 56, marginBottom: 12 },
  ctaBtnDisabled: { opacity: 0.5 },
  ctaBtnText: { fontSize: 17, fontWeight: '800', color: COLORS.bg },
  restoreBtn: { alignItems: 'center', paddingVertical: 12, minHeight: 44 },
  restoreText: { fontSize: 14, color: COLORS.muted },
  legal: { fontSize: 11, color: COLORS.dim, textAlign: 'center', lineHeight: 16, marginTop: 8 },
})
