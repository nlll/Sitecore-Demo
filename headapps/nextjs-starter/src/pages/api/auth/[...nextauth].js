import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your own logic here for validating credentials
        // This is a simple example - in production you should use proper authentication
        if (credentials.username === "test" && credentials.password === "test") {
          return {
            id: "1",
            name: "Demo User",
            email: "user@example.com",
            image: "/avatar.png",
            roles: [],
          };
        }

        if (credentials.username === "admin" && credentials.password === "admin") {
          return {
            id: "2",
            name: "Admin User",
            email: "admin@example.com",
            image: "/avatar.png",
            roles: ["Admin"],
          };
        }

         if (credentials.username === "owner" && credentials.password === "owner") {
          return {
            id: "3",
            name: "Company Owner",
            email: "owner@example.com",
            image: "/avatar.png",
            roles: ["Company Owner", "Company Editor"],
          };
        }

        return null;
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "a-secure-random-string-for-development",
  callbacks: {
    async jwt({ token, user }) {
      // First time jwt callback is called, the user object is available
      if (user) {
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties from token to client
      if (session.user) {
        session.user.roles = token.roles;
      }
      return session;
    },
  },
});