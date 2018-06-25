module.exports = {
  plugins: [
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
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
    }
  ]
};
