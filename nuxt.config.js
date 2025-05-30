export default {
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - todays-progress-card',
    title: 'todays-progress-card',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/tailwindcss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // Enable tree-shaking to reduce bundle size
    treeShake: true,
    // Let Vuetify handle its own CSS imports
    defaultAssets: {
      font: false,
      icons: 'mdi'
    },
    theme: {
      themes: {
        light: {
          primary: '#00897B', // Teal color from design
          accent: '#FF4081',
          secondary: '#FFC107',
          info: '#2196F3',
          warning: '#FB8C00',
          error: '#FF5252',
          success: '#4CAF50'
        }
      }
    },
    components: true,
  },

  // CSS
  css: [
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/css/main.css'
  ],

  build: {
    transpile: ['vuetify/lib'],
    
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    },

    // Updated PostCSS configuration to fix warnings
    postcss: {
      postcssOptions: {
        plugins: {
          'postcss-import': {
            // This helps resolve the @charset issue
          },
          'autoprefixer': {}
        }
      }
    },

    // Additional webpack optimization to handle large bundles
    extend(config, { isClient }) {
      if (isClient) {
        config.optimization.splitChunks.maxSize = 200000;
      }
    }
  }
}