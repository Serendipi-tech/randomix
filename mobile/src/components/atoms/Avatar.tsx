import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { resolveAvatarUri } from '@/constants/avatar-presets';
import { useAppTheme } from '@/utils/useAppTheme';
import { useDominantColor } from '@/utils/useDominantColor';

const DEFAULT_SIZE = 60;
// Spessore ring (border) + padding fra ring e immagine: costante a prescindere da `size`,
// solo l'area del contenuto scala.
const RING_INSET = 8;

type AvatarProps = {
  uri?: string;
  name?: string;
  fallbackColor: string;
  ring?: boolean;
  /** Diametro del ring esterno. Default 60 (dimensione storica, invariata per i chiamanti esistenti). */
  size?: number;
};

/** Avatar circolare con ring colorato ricavato dal colore dominante dell'immagine.
 *  Senza `uri` mostra un riempimento di fallback; senza `name` non mostra la label. */
export function Avatar({ uri, name, fallbackColor, ring = true, size = DEFAULT_SIZE }: AvatarProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  // I preset sono salvati come path relativo: li risolvo in URL assoluto prima di renderizzare.
  const resolvedUri = resolveAvatarUri(uri);
  // L'hook va chiamato sempre (regole degli hook): senza uri passiamo stringa vuota e non mostriamo il ring.
  const ringColor = useDominantColor(resolvedUri ?? '', fallbackColor);
  const showRing = ring && !!resolvedUri;
  const innerSize = size - RING_INSET;

  return (
    <View style={[styles.avatarItem, { width: size }]}>
      <View
        style={[
          styles.avatarRing,
          { width: size, height: size, borderRadius: size / 2, borderColor: showRing ? ringColor : 'transparent' },
        ]}
      >
        {resolvedUri ? (
          <Image
            source={{ uri: resolvedUri }}
            style={[styles.avatar, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              { width: innerSize, height: innerSize, borderRadius: innerSize / 2, backgroundColor: fallbackColor },
            ]}
          />
        )}
      </View>
      {name && (
        <Text style={[styles.avatarName, { color: colors.textColor, width: size }]} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarItem: { alignItems: 'center' },
  avatarRing: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
});
