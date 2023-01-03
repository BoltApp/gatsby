import * as React from "react"
import { graphql, Script } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

const publishableKey = "5OWVUheleCaj.T4LcnlPkT4Ue.e93bda8a3ba796fed56d0fb0a8fe59585c9a434edef3b6e71af984ea315db3b6"
const buttonUrlBase = "https://connect-staging.bolt.com"
export default ({ data }) => (
  <Layout>
    <Script
      async
      id="bolt-track"
      type="text/javascript"
      src="https://connect-staging.bolt.com/track.js"
      data-publishable-key="5OWVUheleCaj.T4LcnlPkT4Ue.e93bda8a3ba796fed56d0fb0a8fe59585c9a434edef3b6e71af984ea315db3b6"
    ></Script>
    <Script
      id="bolt-connect"
      type="text/javascript"
      src="https://connect-staging.bolt.com/connect.js"
      data-publishable-key="5OWVUheleCaj.T4LcnlPkT4Ue.e93bda8a3ba796fed56d0fb0a8fe59585c9a434edef3b6e71af984ea315db3b6"
    ></Script>
    <div className={styles.textCenter}>
      <StaticImage
        src="../images/logo.png"
        alt="Bolt Logo"
        loading="eager"
        formats={["auto", "webp", "avif"]}
      />
    </div>
    <ul className={styles.list}>
      {data.allProduct.nodes.map(product => (
        <li key={product.id} className={styles.listItem}>
          <a
            className={styles.listItemLink}
            href={`${product.url}`}
          >
            {product.name}
          </a>
          {product.product_media.map(media => (
            <img src={media.url} alt={media.url}></img>
          ))}
          <p className={styles.listItemDescription}>{product.description}</p>
          {product.product_prices.map(price => (
            <h2>${price.list_price/100}</h2>
          ))}
          <a href={`${buttonUrlBase}/product_checkout.html?merchant_division_id=AHX6aVWANY_0&publisher_key=06af3ae7a5145505922be60482c5a71e&bolt_product_id=86396606-52e6-5743-a03f-1200cdd8b8c1`}>
            <div data-tid="instant-bolt-checkout-button">
              <object data={`${buttonUrlBase}/v1/checkout_button?publishable_key=${publishableKey}`} />
            </div>
          </a>
        </li>
      ))}
    </ul>
  </Layout>
)

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export const query = graphql`
  {
    allProduct {
      nodes {
        id
        name
        url
        description
        product_media {
          url
        }
        product_prices {
          list_price
        }
      }
    }
  }
`
