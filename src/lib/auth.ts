import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URL!, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});
const db = client.db("wanderlast");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        /**
         * Enables POST /api/auth/request-password-reset.
         * No email provider is configured yet, so in development the reset link
         * is printed to the server console instead of being mailed. Replace this
         * with Resend/SMTP when a provider is available.
         */
        sendResetPassword: async ({ user, url }) => {
            if (process.env.NODE_ENV !== "development") return;
            console.log(
                `\n[Password reset] ${user.email}\nOpen this link to set a new password:\n${url}\n`
            );
        },
    },
    baseURL: process.env.BETTER_AUTH_URL!,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});