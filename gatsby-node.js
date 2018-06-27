const path = require('path');
const preact = path.resolve(__dirname, 'src/preact');

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === `build-javascript`) {
    actions.setWebpackConfig({
      resolve: {
        alias: {
          react: preact,
          'react-dom': preact
        }
      }
    });
  }
};
