module.exports = {
  presets: ['module:@react-native/babel-preset'],

  env: {
    // Release builds only. Without this, every console.log in the app — error
    // payloads, Stripe checkout URLs — is written to the device log on a
    // user's phone, readable by anyone with the device or a log tool.
    production: {
      plugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]],
    },
  },
};
