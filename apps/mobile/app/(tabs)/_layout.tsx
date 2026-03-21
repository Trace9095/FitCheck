import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { getStoredSession } from '../../lib/storage'

// ─── Simple icon components (no lucide-react-native needed) ───────────────

function GridIcon({ color }: { color: string }) {
  return (
    <View style={iconStyles.grid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[iconStyles.gridDot, { backgroundColor: color }]} />
      ))}
    </View>
  )
}

function StarIcon({ color }: { color: string }) {
  return (
    <View style={iconStyles.starWrap}>
      <Text style={[iconStyles.starText, { color }]}>★</Text>
    </View>
  )
}

function PlusIcon({ active }: { active: boolean }) {
  return (
    <View style={[iconStyles.plusBubble, active && iconStyles.plusBubbleActive]}>
      <View style={[iconStyles.plusH, { backgroundColor: active ? '#0D1117' : '#8B949E' }]} />
      <View style={[iconStyles.plusV, { backgroundColor: active ? '#0D1117' : '#8B949E' }]} />
    </View>
  )
}

function TrophyIcon({ color }: { color: string }) {
  return (
    <View style={iconStyles.starWrap}>
      <Text style={[iconStyles.starText, { color }]}>⊕</Text>
    </View>
  )
}

function PersonIcon({ color }: { color: string }) {
  return (
    <View style={iconStyles.personWrap}>
      <View style={[iconStyles.personHead, { borderColor: color }]} />
      <View style={[iconStyles.personBody, { borderColor: color }]} />
    </View>
  )
}

const iconStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 20, height: 20, gap: 2 },
  gridDot: { width: 8, height: 8, borderRadius: 2 },
  starWrap: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  starText: { fontSize: 20, lineHeight: 24 },
  plusBubble: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#30363D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  plusBubbleActive: { backgroundColor: '#D4A853' },
  plusH: { position: 'absolute', width: 16, height: 2, borderRadius: 1 },
  plusV: { position: 'absolute', width: 2, height: 16, borderRadius: 1 },
  personWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'flex-end' },
  personHead: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, marginBottom: 2 },
  personBody: {
    width: 18,
    height: 8,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 1.5,
    borderBottomWidth: 0,
  },
})

// ─── Auth gate ────────────────────────────────────────────────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    getStoredSession().then((s) => {
      setAuthed(!!s?.token)
      setChecked(true)
    })
  }, [])

  if (!checked) return null
  if (!authed) return <Redirect href="/(auth)/login" />
  return <>{children}</>
}

export default function TabsLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#0D1117' },
          headerTintColor: '#E6EDF3',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          tabBarStyle: {
            backgroundColor: '#161B22',
            borderTopColor: '#30363D',
            borderTopWidth: 1,
            height: 84,
            paddingBottom: 20,
            paddingTop: 6,
          },
          tabBarActiveTintColor: '#D4A853',
          tabBarInactiveTintColor: '#8B949E',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Feed',
            tabBarLabel: 'Feed',
            tabBarIcon: ({ color }) => <GridIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="rate"
          options={{
            title: 'Rate Fits',
            tabBarLabel: 'Rate',
            tabBarIcon: ({ color }) => <StarIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: 'Post Outfit',
            tabBarLabel: 'Post',
            tabBarIcon: ({ focused }) => <PlusIcon active={focused} />,
          }}
        />
        <Tabs.Screen
          name="challenges"
          options={{
            title: 'Challenges',
            tabBarLabel: 'Events',
            tabBarIcon: ({ color }) => <TrophyIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <PersonIcon color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  )
}
