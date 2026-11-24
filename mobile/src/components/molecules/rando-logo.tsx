import { Image, StyleSheet } from 'react-native';

const LOGO_SIZE = 140;

/** Logo dell'app, puramente presentazionale: l'animazione d'ingresso è guidata da chi lo usa (vedi useAuthIntro). */
export function RandoLogo() {
  return <Image source={require('../../../assets/images/randologo.png')} style={styles.logo} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
