require("dotenv").config()

module.exports = {
  siteMetadata: {
    siteTitle: "Bolt ECommerce Starter",
    siteTitleDefault: "gatsby-starter-shopify by @GatsbyJS",
    siteUrl: "https://shopify-demo.gatsbyjs.com",
    siteDescription:
      "A Gatsby starter using the latest Shopify plugin showcasing a store with product overview, individual product pages, and a cart.",
    siteImage: "/default-og-image.jpg",
    twitter: "@gatsbyjs",
  },
  flags: {
    FAST_DEV: true,
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-gatsby-cloud",
    // Add your Google Analytics ID to the .env file to enable
    // Otherwise, this plugin can be removed
    process.env.GOOGLE_ANALYTICS_ID && {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
      },
    },
    {
      resolve: '../source-plugin',
      options: {
        merchantPublicID: "Abo1BwgVittV", // T4LcnlPkT4Ue or UwOlJPVyzc95
      },
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: "bolt-long-lambda-artifact-dev",
        region: "us-west-2",
      },
    },
  ].filter(Boolean),
}
