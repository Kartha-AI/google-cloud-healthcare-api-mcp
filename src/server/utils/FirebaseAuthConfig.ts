export interface FirebaseAuthConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    callbackPort: string;
}

export interface FirebaseToken {
    access_token: string;
    refresh_token: string;
    expires_at: Date;
    uid: string;
    displayName?: string | null;
    email?: string | null;
}