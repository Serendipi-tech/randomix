import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { Accent } from '@/constants/theme';

interface UserAvatarProps {
  username: string;
  avatarUrl: string | null;
  size?: number;
}

/** Avatar circolare: immagine se presente, altrimenti iniziale su fondo colorato. */
export function UserAvatar({ username, avatarUrl, size = 48 }: UserAvatarProps) {
  const radius = size / 2;

  if (avatarUrl) {
    return (
      <Image source={{ uri: avatarUrl }} style={{ width: size, height: size, borderRadius: radius }} />
    );
  }

  return (
    <View
      style={[styles.fallback, { width: size, height: size, borderRadius: radius }]}>
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>
        {username.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: Accent.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#fff',
  },
});
