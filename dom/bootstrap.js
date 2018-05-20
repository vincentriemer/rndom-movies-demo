import { RNDomInstance } from "react-native-dom";

// Path to RN Bundle Entrypoint ================================================
const rnBundlePath = "./entry.bundle?platform=dom&dev=true";

// React Native DOM Runtime Options =============================================
import FontLoader from "./native-modules/FontLoader";

const ReactNativeDomOptions = {
  enableHotReload: true,
  nativeModules: [FontLoader]
};

// App Initialization ============================================================
const app = new RNDomInstance(
  rnBundlePath,
  "MovieDemo",
  document.body,
  ReactNativeDomOptions
);

app.start();
