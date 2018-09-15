/**
 * @flow
 */

import { RCTModule } from "react-native-dom";
import FontFaceObserver from "fontfaceobserver";

import type { RCTBridge } from "react-native-dom";

export default class FontLoader extends RCTModule {
  static moduleName = "FontLoader";

  $$loadFont(name: string, url: string) {
    // generate font-face css string
    const fontStyles = `@font-face {
      src: url(${url});
      font-family: ${name}
    }`;

    // create stylesheet
    const style: any = document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = fontStyles;
    } else {
      style.appendChild(document.createTextNode(fontStyles));
    }

    // inject stylesheet
    if (document.head) {
      document.head.appendChild(style);
    } else {
      return this.bridge.callbackFromId(rejectId);
    }

    // load font
    const font = new FontFaceObserver(name);
    return font.load();
  }
}
