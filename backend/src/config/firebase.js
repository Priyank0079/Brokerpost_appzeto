const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

// Only initialize once (guard for hot-reloading in development)
if (getApps().length === 0) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID || "brokerspost-1e160",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "b595fe0da0ea2dc80e97b71957c43da2c079fa49",
    // The private key is stored in .env with literal \n — we replace them here
    private_key: (process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQFoOb9vjkwUch\n3RPH+j4SYYi0JqaX40UVkLy2MWtKkqbKiBnPAdxC2VlX26m49sBvrvAnrsdHVuF6\npIdyR5rXUafhFxGkYjkjaqa+WepKpJbLN4QxjAib6dRo4x3eQX5qo635knzN7pkx\nuLMA9eE1J/OaY1sSqy1QqX80BJw/clSptzpPuKvsnLsQxN5bh1NjWwDKKFmjSKI5\n9mGxFQFrtxBbpHd48hCOycllwXV9Td3kVyFroPG9HkrRs46b56I5znYsAFXIpCqL\nU8FHpKAhtkb/zBtaf6K7DvrmVL+c2mUUxHhELrImH7SGeem2tf9RZyyYUOIdcltA\nKrQnJIBdAgMBAAECggEAA79mPPIshXhcwEiEbbtF5416xpTsKucg/0F6Y99EzHS1\nygcBwRPni5cInTY9EfgLtXohJCIvM/of6kqWvnK/PWSyC3fOHwkyvidpzUlhXnCC\nJRug5wBy9T5xz2U9NRAHimt/D/Qeq/EqdlYDA6t1n8Aj3CgxHcGMecp4yQ8YYR81\nASvqyFgzACRODMAwVo8PqgXGDTNwqs4ogFGu7y/JiHp6XiGJlIAKAkJX59u92hzx\n4gPnTlc0G268SxSTo5wm5dW/FqlvEljS0i5zZkCo0XyJ5AB41yj8GBmkb5T+Eokc\nZjUxYiZXy6lk9ims7rGgKYb7XVaPsFKhOV3RsVcfpwKBgQD0OJx4YzYOa+3jPBGb\nLgYC9bMz5I9erCRdV5tteYkcb598lvm1mo6fmt/JJKv2FaSxeY5PDZD4Zx69NWfr\nJcThmv0j59QG0t6w+n5q1zU0KTpQQPYwUUu3Dt8bdOPEb1vVm1uAEnUkWHLxsb29\nGna8UGQCeICioFT+uwoPpTc1bwKBgQDaH8SNrOLmJW8VwD21Rw0SUf7lPlFJgWXm\nl0px5NVfa8nTYd1ESmxmmwLWshTmY/fs6Aktr0GdI0KfOnx65FoHPaimtz+ZufY9\nJBKfDbAb22cSBoSoYeZTuOcWnOTnwomRJm3rItQde4zmk3NoERRWt7swrgz4uAKi\nXpcpF3u48wKBgEP+NuH1jSk6t0JaiPRRPe85BKlf6uKKvp0WNPmnqpq2IQsI5YDA\nBRE+hytzAEVFBVM76njr5/6ghxhadBIts8Cz6+JBOvCjaMiRFP0d6XwaNlf9ng0Z\ntSDEDS2Rv5ADCOhRlonzmZWC4o2T1KV/ZqtLHmzpq7abOM6quERe1R4VAoGAQlUK\n1vLOhaK4p2qw2WHkDcA1vc03txzMulUj5ILsiHolBE1slonzcTiOom/Bf1bDXJ4r\nvGLhl0HTzsxgcpbi8fTERv7PLpao1WsU5p2pAq+0Jn0o9nPfMXK3g97ulbRJVYTU\nRH9w9g5OiQgqPmmDP+Pb3y/u7ew3kN0nJu3nSBUCgYEA0WgCVQCTj+vUl6mwmsFc\nAAz/wqCK7LYcPs8AcAnsGgDeHwToXxvU2zRsiU7AZ+p6HLp0z7dLh5uR/J3hHl1s\nn+NHjNKq/VL+lVSV00Y+TnU5A82zQvs32PZGOHLZvkgwRBWHFipLfTLLAIRhpSo2\nia/GiCdkymAJhzwIjibhAr8=\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@brokerspost-1e160.iam.gserviceaccount.com",
    client_id: process.env.FIREBASE_CLIENT_ID || "111515433056798472297",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40brokerspost-1e160.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  };

  try {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
    console.log('✅ Firebase Admin SDK initialized');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  }
}

module.exports = { getMessaging };
