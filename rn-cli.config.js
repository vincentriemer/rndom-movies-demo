var config = {
  getPlatforms() {
    return ["dom", "ios", "android"];
  },
  getProvidesModuleNodeModules() {
    return ["react-native", "react-native-dom"];
  },
};

module.exports = config;
