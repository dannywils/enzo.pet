import React from 'react';
import { graphql } from 'gatsby';
import GatsbyImage from 'gatsby-image';

import './style.css';

export default class extends React.Component {
  state = {
    image: 0
  };

  showNextImage = () => {
    this.setState(prevState => {
      return {
        image: (prevState.image + 1) % this.props.data.allFile.edges.length
      };
    });
  };

  render() {
    const { edges } = this.props.data.allFile;
    return (
      <div className="wrapper" onClick={this.showNextImage}>
        <GatsbyImage
          fluid={edges[this.state.image].node.childImageSharp.fluid}
        />
      </div>
    );
  }
}

export const PageQuery = graphql`
  query IndexQuery {
    allFile {
      edges {
        node {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
