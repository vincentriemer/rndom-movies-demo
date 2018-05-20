const blacklist = require("metro/src/blacklist");

var config = {
  getPlatforms() {
    return ["dom", "ios", "android"];
  },
  getProvidesModuleNodeModules() {
    return ["react-native", "react-native-dom"];
  },
  getBlacklistRE() {
    return blacklist([
      /\.yalc.*/,
      /react-native\/local-cli\/core\/__fixtures__.*/,
    ]);
  },
};

module.exports = config;
