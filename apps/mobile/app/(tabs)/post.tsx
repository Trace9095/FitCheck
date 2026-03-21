import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'react-native'
import { apiPost } from '../../lib/api'
import { getStoredSession } from '../../lib/storage'

const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  gold: '#D4A853',
  text: '#E6EDF3',
  muted: '#8B949E',
}

const CATEGORIES = ['Streetwear', 'Business', 'Casual', 'DateNight', 'Festival', 'Gym'] as const
type Category = typeof CATEGORIES[number]

type Phase = 'compose' | 'uploading' | 'posting' | 'done'

export default function PostScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [caption, setCaption] = useState('')
  const [phase, setPhase] = useState<Phase>('compose')

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo access to post an outfit.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    })
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri)
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow camera access to take a photo.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    })
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri)
    }
  }

  async function handlePost() {
    if (!imageUri || !category) {
      Alert.alert('Missing info', 'Select a photo and category first.')
      return
    }

    setPhase('uploading')

    try {
      // Upload image to /api/upload
      const session = await getStoredSession()
      const formData = new FormData()
      formData.append('file', {
        uri: imageUri,
        name: 'outfit.jpg',
        type: 'image/jpeg',
      } as any)

      const uploadRes = await fetch(
        `${process.env['EXPO_PUBLIC_API_URL'] ?? 'http://192.168.1.100:3000'}/api/upload`,
        {
          method: 'POST',
          headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
          body: formData,
        }
      )

      if (!uploadRes.ok) throw new Error('Upload failed')
      const { data: uploadData } = await uploadRes.json()
      const imageUrl: string = uploadData.url

      setPhase('posting')

      await apiPost('/api/outfits', {
        imageUrl,
        category,
        caption: caption.trim() || undefined,
      })

      setPhase('done')
    } catch (err: any) {
      setPhase('compose')
      Alert.alert(
        'Post failed',
        err?.message?.includes('Free tier')
          ? 'Free plan allows 1 post/day. Upgrade to Pro for unlimited posts.'
          : 'Something went wrong. Try again.'
      )
    }
  }

  function reset() {
    setImageUri(null)
    setCategory(null)
    setCaption('')
    setPhase('compose')
  }

  if (phase === 'done') {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.doneIcon}>✓</Text>
        <Text style={styles.doneTitle}>Fit posted!</Text>
        <Text style={styles.doneBody}>Your outfit is live. Go check the ratings!</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={reset} activeOpacity={0.85}>
          <Text style={styles.doneBtnText}>Post another fit</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const isLoading = phase === 'uploading' || phase === 'posting'

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      {/* Image picker */}
      {imageUri ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage} disabled={isLoading}>
            <Text style={styles.changePhotoBtnText}>Change photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.photoPickerArea}>
          <Text style={styles.photoPickerIcon}>+</Text>
          <Text style={styles.photoPickerTitle}>Add your outfit photo</Text>
          <Text style={styles.photoPickerSub}>3:4 portrait ratio works best</Text>
          <View style={styles.photoPickerBtns}>
            <TouchableOpacity style={styles.photoBtn} onPress={pickImage} activeOpacity={0.85}>
              <Text style={styles.photoBtnText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.photoBtn, styles.photoBtnOutline]} onPress={takePhoto} activeOpacity={0.85}>
              <Text style={styles.photoBtnOutlineText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Category */}
      <Text style={styles.sectionLabel}>Category</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, category === cat && styles.catChipActive]}
            onPress={() => setCategory(cat)}
            disabled={isLoading}
            activeOpacity={0.75}
          >
            <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Caption */}
      <Text style={styles.sectionLabel}>Caption (optional)</Text>
      <TextInput
        style={styles.captionInput}
        value={caption}
        onChangeText={setCaption}
        placeholder="Describe your fit..."
        placeholderTextColor={COLORS.muted}
        multiline
        maxLength={500}
        editable={!isLoading}
      />
      <Text style={styles.charCount}>{caption.length}/500</Text>

      {/* Post button */}
      <TouchableOpacity
        style={[styles.postBtn, (isLoading || !imageUri || !category) && styles.postBtnDisabled]}
        onPress={handlePost}
        disabled={isLoading || !imageUri || !category}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={COLORS.bg} size="small" />
            <Text style={styles.postBtnText}>
              {phase === 'uploading' ? 'Uploading...' : 'Posting...'}
            </Text>
          </View>
        ) : (
          <Text style={styles.postBtnText}>Post Outfit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 16, paddingBottom: 40 },
  center: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  photoPickerArea: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.surface,
    minHeight: 200,
    justifyContent: 'center',
  },
  photoPickerIcon: { fontSize: 48, color: COLORS.muted, marginBottom: 8 },
  photoPickerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  photoPickerSub: { fontSize: 13, color: COLORS.muted, marginBottom: 20 },
  photoPickerBtns: { gap: 10, width: '100%', maxWidth: 280 },
  photoBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  photoBtnText: { color: COLORS.bg, fontWeight: '700', fontSize: 15 },
  photoBtnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border },
  photoBtnOutlineText: { color: COLORS.text, fontWeight: '600', fontSize: 15 },
  previewWrap: { marginBottom: 20 },
  preview: { width: '100%', aspectRatio: 3 / 4, borderRadius: 16 },
  changePhotoBtn: {
    marginTop: 10,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoBtnText: { color: COLORS.muted, fontSize: 14, fontWeight: '600' },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 36,
    justifyContent: 'center',
  },
  catChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  catChipText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  catChipTextActive: { color: COLORS.bg },
  captionInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 4,
  },
  charCount: { fontSize: 12, color: COLORS.muted, textAlign: 'right', marginBottom: 20 },
  postBtn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  postBtnDisabled: { opacity: 0.5 },
  postBtnText: { color: COLORS.bg, fontSize: 17, fontWeight: '700' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  // Done screen
  doneIcon: { fontSize: 64, color: COLORS.gold, marginBottom: 8 },
  doneTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  doneBody: { fontSize: 15, color: COLORS.muted, marginBottom: 32, textAlign: 'center' },
  doneBtn: {
    height: 52,
    paddingHorizontal: 32,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: { color: COLORS.bg, fontSize: 16, fontWeight: '700' },
})
