import * as React from "react"
import { graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

export default ({ data }) => (
  <Layout>
    <div className={styles.textCenter}>
      <StaticImage
        src="../images/example.png"
        loading="eager"
        width={64}
        quality={95}
        formats={["auto", "webp", "avif"]}
        alt=""
        style={{ marginBottom: `var(--space-3)` }}
      />
      <h1>
        Welcome to <b>Bolt</b>
      </h1>
    </div>
    <ul className={styles.list}>
      {data.allProduct.nodes.map(product => (
        <li key={product.id} className={styles.listItem}>
          <a
            className={styles.listItemLink}
            href={`${product.url}`}
          >
            {product.name} ↗
          </a>
          {product.product_media.map(media => (
            <img src={media.url}></img>
          ))}
          <p className={styles.listItemDescription}>{product.description}</p>
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
      }
    }
  }
`
