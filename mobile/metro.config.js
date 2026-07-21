const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// lucide-react-native va in conflitto con la risoluzione via "exports" di Metro (PackageResolutionError
// su .../index). Disattivarla del tutto rompeva altri pacchetti che DIPENDONO da "exports" sul web
// (react-native-svg, safe-area-context) — quindi la reindirizziamo solo per questo pacchetto.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'lucide-react-native') {
    try {
      return {
        type: 'sourceFile',
        filePath: require.resolve('lucide-react-native/dist/esm/lucide-react-native.js', {
          paths: [__dirname, require('path').join(__dirname, '..')],
        }),
      };
    } catch {
      // fallback: Metro risolve normalmente
    }
  }
  if (defaultResolveRequest) return defaultResolveRequest(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './src/global.css' });
