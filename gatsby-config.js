module.exports = {
  siteMetadata: {
    url: `https://enzo.pet`,
    title: `He's a good boy`,
    description: `The best boy.`,
    twitter: `@dannywils`
  },
  plugins: [
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          '/*': [`Cache-Control: max-age=31536000`],
          '/*.html': [`Cache-Control: max-age=0, must-revalidate, public`]
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/images/`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `audio`,
        path: `${__dirname}/audio/`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-39372803-2'
      }
    }
  ]
};
