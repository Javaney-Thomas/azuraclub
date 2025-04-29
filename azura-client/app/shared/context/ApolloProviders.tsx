"use client";

import client from "@/app/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";

export function ApolloProviders({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
