// Auth.ts
import { platform } from 'node:os';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'node:crypto';
import os from 'os';
import { FirebaseAuthConfig, FirebaseToken} from './FirebaseAuthConfig.js';

import express from 'express';

interface StateHandler {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  pendingOperation: () => Promise<any>;
}

export class Auth {
  private authConfig: FirebaseAuthConfig;
  private token: FirebaseToken | null = null;
  private callbackServer: any;
  private authState = new Map<string, StateHandler>();
  
  constructor(authConfig: FirebaseAuthConfig) {
    this.authConfig = authConfig;
    this.setupCallbackServer()
  }

  async getAccessToken() {
    
    return this.token!.access_token;
  }

  async executeWithAuth<T>(operation: () => Promise<T>): Promise<T> {
    try {
      if (this.token && !this.isTokenExpired()) {
        return await operation();
      }

      // Need to authenticate first
      return new Promise<T>((resolve, reject) => {
          // console.log("Opening browser for authentication...");

          const state = randomUUID();
          this.authState.set(state, {
            resolve,
            reject,
            pendingOperation: operation
          });
    
          // Create the auth HTML file with injected config
          const authHtmlPath =  this.createAuthHtmlWithConfig(this.authConfig,state);

          // Rest of the method remains the same, but use tempAuthPath
          const authUrl = `file://${authHtmlPath}`;
          
          // Open browser with the auth page
          this.openBrowser(authUrl).catch(reject);
              
          });
    } catch (error: any) {
      if (error.message && error.message.includes('refresh')) {
        this.token = null;
        return this.executeWithAuth(operation);
      }
      throw error;
    }
  }

  private setupCallbackServer() {
    const app = express();
    const callbackPort = Number(this.authConfig.callbackPort);
    
    //callback handler
    app.get('/firebase-auth/callback', async (req, res) => {      

      const {token, state, error } = req.query;
      const stateHandler = this.authState.get(state as string);
  
      if (!stateHandler) {
        console.error('No state handler found for state:', state);
        res.status(400).send('Invalid state');
        return;
      }

      try {
        if (error) {
          stateHandler.reject(new Error(error as string));
        } else {
          const decodedToken = decodeURIComponent(token as string);
          this.token= JSON.parse(decodedToken);
        
          // Execute the pending operation with the new token
          const result = await stateHandler.pendingOperation();
          stateHandler.resolve(result);
        }
      } catch (err) {
        stateHandler.reject(err as Error);
      } finally {
        this.authState.delete(state as string);
      }
      try {
          const filePath = fileURLToPath(new URL('./auth-success.html', import.meta.url));
          res.sendFile(filePath);
      } catch (error) {
          console.error('Error reading auth success template:', error);
          res.send('Authentication successful! You can close this window.');
      }
    })
    
    // Add a test endpoint to verify server is running
    app.get('/health', (req, res) => {
      res.send('Firebase Auth callback server is running');
    });

    this.callbackServer = app.listen(callbackPort, () => {
        // console.log(`OAuth callback server listening at http://localhost:${port}`);
    });

    this.callbackServer.on('error', (error:any) => {
      if ((error as any).code === 'EADDRINUSE') {
        throw new Error(`Port ${callbackPort} is already in use`);
      }
    });

    // Add graceful shutdown
    process.on('SIGTERM', () => {
      this.callbackServer.close(() => {
        console.log('OAuth server closed');
      });
    });
  }

  public openBrowser = async (url: string): Promise<void> => {
    // Platform-specific commands
    const commands: Record<string, string> = {
      darwin: `open "${url}"`,              // macOS
      win32: `start "" "${url}"`,           // Windows 
      linux: `xdg-open "${url}"`            // Linux
    };
    
    const cmd = commands[platform()];
    if (!cmd) {
      throw new Error('Unsupported platform');
    }
  
    return new Promise<void>((resolve, reject) => {
      exec(cmd, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  };

  private isTokenExpired(): boolean {
    if (!this.token?.expires_at) return true;
    // Add 5 minute buffer
    return new Date(this.token.expires_at).getTime() - 5 * 60 * 1000 < Date.now();
  }
  
  // Get the current token (for external use)
  public getToken(): FirebaseToken | null {
    return this.token;
  }

  private createAuthHtmlWithConfig(firebaseAuthConfig: FirebaseAuthConfig,state:any): string {
    // Read the auth htmtl file
    const templatePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'firebase-auth.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');
    
    const tenantId = process.env.FIREBASE_TENANT_ID || 'providers-1d13d';
    
    // Replace placeholders in the template with actual values
    htmlContent = htmlContent.replace(
      '/* FIREBASE_CONFIG */',
      `const firebaseConfig = ${JSON.stringify(firebaseAuthConfig, null, 2)};
      const TENANT_ID = "${tenantId}";
      const STATE = "${state}";
      `
    );
    
    // Write to a temporary file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `firebase-auth-${Date.now()}.html`);
    fs.writeFileSync(tempFilePath, htmlContent);
    
    return tempFilePath;
  }
}

export default Auth;