// __mocks__/vuetify-lib.js
export default {
  // Mock Vuetify components as needed
  VCard: { name: 'VCard', template: '<div><slot></slot></div>' },
  VCardTitle: { name: 'VCardTitle', template: '<div><slot></slot></div>' },
  VCardText: { name: 'VCardText', template: '<div><slot></slot></div>' },
  VProgressLinear: { name: 'VProgressLinear', template: '<div></div>' },
  VProgressCircular: { name: 'VProgressCircular', template: '<div></div>' }
  // Add other Vuetify components you use in your tests
}
