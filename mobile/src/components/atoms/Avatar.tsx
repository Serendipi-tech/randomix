import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { resolveAvatarUri } from '@/constants/avatar-presets';
import { useAppTheme } from '@/utils/useAppTheme';
import { useDominantColor } from '@/utils/useDominantColor';

type AvatarProps = {
  uri?: string;
  name?: string;
  fallbackColor: string;
  ring?: boolean;
};

/** Avatar circolare con ring colorato ricavato dal colore dominante dell'immagine.
 *  Senza `uri` mostra un riempimento di fallback; senza `name` non mostra la label. */
export function Avatar({ uri, name, fallbackColor, ring = true }: AvatarProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  // I preset sono salvati come path relativo: li risolvo in URL assoluto prima di renderizzare.
  const resolvedUri = resolveAvatarUri(uri);
  // L'hook va chiamato sempre (regole degli hook): senza uri passiamo stringa vuota e non mostriamo il ring.
  const ringColor = useDominantColor(resolvedUri ?? '', fallbackColor);
  const showRing = ring && !!resolvedUri;

  return (
    <View style={styles.avatarItem}>
      <View style={[styles.avatarRing, { borderColor: showRing ? ringColor : 'transparent' }]}>
        {resolvedUri ? (
          <Image source={{ uri: resolvedUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: fallbackColor }]} />
        )}
      </View>
      {name && (
        <Text style={[styles.avatarName, { color: colors.textColor }]} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarItem: { alignItems: 'center', width: 60 },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
    width: 60,
  },
});
