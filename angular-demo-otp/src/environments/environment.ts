export const environment = {
  production: false,
  apiUrl: 'http://localhost:8083/2fa',
  otpTimeout: 30, // seconds
  otpLength: 6,
  mockOtpCode: '123456', // Only for development
  features: {
    enableMockAuth: true,
    enable2FA: true,
    enablePasswordReset: true,
  }
}; 