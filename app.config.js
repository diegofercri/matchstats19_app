export default {
  expo: {
    name: "Tu App de Fútbol", // Cambia por el nombre de tu app
    slug: "tu-app-futbol", // Cambia por tu slug
    version: "1.0.0",
    orientation: "portrait",
    // Solo incluir icon si existe el archivo
    // icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    // Configuración básica de splash sin archivo específico
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tucompania.tuapp" // Cambia por tu bundle ID
    },
    android: {
      // Solo incluir adaptive icon si existe el archivo
      // adaptiveIcon: {
      //   foregroundImage: "./assets/adaptive-icon.png",
      //   backgroundColor: "#ffffff"
      // },
      package: "com.tucompania.tuapp" // Cambia por tu package name
    },
    web: {
      // favicon: "./assets/favicon.png", // Comentado hasta que tengas el archivo
      bundler: "metro"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    scheme: "tu-app", // Cambia por tu scheme
    // ✅ AQUÍ ESTÁN LAS VARIABLES DE ENTORNO
    extra: {
      apiFootballKey: process.env.API_FOOTBALL_KEY,
      apiFootballHost: process.env.API_FOOTBALL_HOST || 'v3.football.api-sports.io',
      // Puedes agregar más variables aquí
      apiBaseUrl: process.env.API_BASE_URL || 'https://v3.football.api-sports.io',
      environment: process.env.NODE_ENV || 'development'
    }
  }
};