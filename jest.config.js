process.env.API_URL = 'https://test-api.friendslibrary.com';
process.env.CLOUD_STORAGE_ENDPOINT = '/cloud/endpoint';
process.env.CLOUD_STORAGE_KEY = 'cloud-key';
process.env.CLOUD_STORAGE_SECRET = 'cloud-secret';
process.env.CLOUD_STORAGE_BUCKET_URL = '/cloud/bucket';
process.env.CLOUD_STORAGE_BUCKET = 'bucket';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '__tests__/.*spec\\.ts$',
};
