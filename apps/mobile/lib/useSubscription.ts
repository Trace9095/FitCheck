import { useRevenueCat } from './revenuecat'

export function useSubscription() {
  const { isPro, loading, purchasePackage, restorePurchases } = useRevenueCat()
  return {
    isPro,
    isSubscribed: isPro,
    hasPremium: isPro,
    loading,
    purchasePackage,
    restorePurchases,
  }
}
