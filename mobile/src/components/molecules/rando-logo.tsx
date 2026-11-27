import { Image } from 'react-native';

/** Misura storica, usata fuori dall'app: resta il default per non cambiare i chiamanti esistenti. */
const DEFAULT_LOGO_SIZE = 140;

type RandoLogoProps = {
  /** Lato del logo: ridotto dove serve (es. intestazione di pagina). */
  size?: number;
};

/** Logo dell'app, puramente presentazionale: l'animazione d'ingresso è guidata da chi lo usa (vedi useAuthIntro). */
export function RandoLogo({ size = DEFAULT_LOGO_SIZE }: RandoLogoProps) {
  return (
    <Image
      source={require('../../../assets/images/randologo.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
