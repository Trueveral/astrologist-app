import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import {
  type CredentialsConfig,
  CredentialsProvider,
} from "next-auth/providers/credentials";
import { prisma } from "~/server/db";
import { type User } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

interface Credentials {
  email: string;
  password: string;
}

const credentialsConfig: CredentialsConfig = {
  name: "Email and Password",
  credentials: {
    email: { label: "Email", type: "text", placeholder: "" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials: Credentials) {
    const res: User | null = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (res?.password === credentials.password) {
      return {
        id: res?.id,
        name: res?.username,
        email: res?.email,
      };
    }
    return null;
  },
};

const providers = [
  GithubProvider({
    clientId: process.env.GITHUB_ID ?? "",
    clientSecret: process.env.GITHUB_SECRET ?? "",
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_ID ?? "",
    clientSecret: process.env.GOOGLE_SECRET ?? "",
  }),
  EmailProvider({
    server: "smtp.gmail.com",
    from: "",
  }),
];

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: providers,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    signOut: "/auth/logout",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.email = user.email;
        session.user.id = user.id;
        session.user.name = user.name;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.type === "oauth") {
        const existingUser = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account?.provider,
              providerAccountId: account?.providerAccountId,
            },
          },
        });
        if (!existingUser) {
          const u = await prisma.user.create({
            data: {
              email: user?.email,
              username: user?.name,
            },
          });

          await prisma.account.create({
            data: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              expires_at: account.expires_at,
              id_token: account.id_token,
              token_type: account.token_type,
              user: {
                connect: {
                  id: u.id,
                },
              },
            },
          });

          return true;
        } else {
          await prisma.account.update({
            where: {
              provider_providerAccountId: {
                provider: account?.provider,
                providerAccountId: account?.providerAccountId,
              },
            },
            data: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              expires_at: account.expires_at,
              id_token: account.id_token,
              token_type: account.token_type,
            },
          });
          return true;
        }
      }

      return true;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
