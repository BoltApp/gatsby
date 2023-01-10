import * as React from "react"
import { createClient, Provider as UrlqProvider } from "urql"

export const urqlClient = createClient({
  url: `https://hasura.staging-bolt.me/v1/graphql`,
  fetchOptions: {
    headers: {
    },
  },
})

export function SearchProvider({ children }) {
  return <UrlqProvider value={urqlClient}>{children}</UrlqProvider>
}
