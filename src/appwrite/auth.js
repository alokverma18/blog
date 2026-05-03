import conf from '../config/config.js';
import { Client, Account, ID, OAuthProvider } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }

    async loginWithGoogle(){
        try {
            // Use OAuth2 token approach instead of session
            const token = await this.account.createOAuth2Token({
                provider: OAuthProvider.Google,
                success: `${window.location.origin}/oauth-success`,
                failure: `${window.location.origin}/login`,
                scopes: ['openid', 'profile', 'email']
            });
            return token;
        } catch (error) {
            throw error;
        }
    }

    async handleOAuthSuccess() {
        try {
            // Extract OAuth credentials from URL parameters (as per Appwrite docs)
            const urlParams = new URLSearchParams(window.location.search);
            const secret = urlParams.get('secret');
            const userId = urlParams.get('userId');
            
            if (secret && userId) {
                // Create a proper session using OAuth credentials
                try {
                    const session = await this.account.createSession({ userId, secret });
                    
                    // Now get user data (this should work with proper session)
                    const userData = await this.account.get();
                    return userData;
                    
                } catch (sessionError) {
                    // Session creation failed
                }
            }
            
            return null;
        } catch (error) {
            return null;
        }
    }

    async updateName(name) {
        try {
            await this.account.updateName(name);
            // After updating name, get the updated user data
            return await this.account.get();
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService

