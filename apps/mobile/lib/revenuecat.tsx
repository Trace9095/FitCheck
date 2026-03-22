// STUB — react-native-purchases requires a dev build (EAS or TestFlight)
// The SDK package is installed and will activate in EAS builds.
import React, { createContext, useContext } from 'react'
import { Alert } from 'react-native'

interface RevenueCatContextValue {
  isPro: boolean
  customerInfo: null
  loading: boolean
  purchasePackage: (pkg: unknown) => Promise<boolean>
  restorePurchases: () => Promise<void>
}

const RevenueCatContext = createContext<RevenueCatContextValue>({
  isPro: false,
  customerInfo: null,
  loading: false,
  purchasePackage: async () => false,
  restorePurchases: async () => {},
})

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  async function purchasePackage(_pkg: unknown): Promise<boolean> {
    Alert.alert(
      'Subscriptions',
      'In-app purchases require a production build. Use TestFlight or EAS build.',
    )
    return false
  }

  async function restorePurchases() {
    Alert.alert('Restore Purchases', 'Restore requires a production build via TestFlight or EAS.')
  }

  return (
    <RevenueCatContext.Provider
      value={{ isPro: false, customerInfo: null, loading: false, purchasePackage, restorePurchases }}
    >
      {children}
    </RevenueCatContext.Provider>
  )
}

export function useRevenueCat(): RevenueCatContextValue {
  return useContext(RevenueCatContext)
}
