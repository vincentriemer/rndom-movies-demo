import { NativeModules, Platform } from "react-native";
import resolveAssetSource from "resolveAssetSource";

const FontLoader = NativeModules.FontLoader;

export const Font = {
  loadedFonts: [],
  isLoaded(fontName: string) {
    return this.loadedFonts.includes(fontName);
  },
  loadAsync(fontConfig: { [fontName: string]: string }) {
    return Platform.OS === "dom"
      ? Promise.all(
          Object.entries(fontConfig).map(([name, assetId]) => {
            const asset = resolveAssetSource(assetId);
            if (asset) {
              return FontLoader.loadFont(name, asset.uri).then(() => {
                this.loadedFonts.push(name);
              });
            } else {
              return Promise.reject();
            }
          })
        )
      : Promise.resolve();
  },
};
