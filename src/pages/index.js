import React from 'react';
import { graphql } from 'gatsby';
import GatsbyImage from 'gatsby-image';

import './style.css';

export default class extends React.Component {
  state = {
    image: 0
  };

  componentDidMount() {
    this.audio = new Audio('/bark.wav');
  }

  showNextImage = () => {
    this.audio.play();

    this.setState(prevState => {
      return {
        image: (prevState.image + 1) % this.props.data.allFile.edges.length
      };
    });
  };

  render() {
    const { edges } = this.props.data.allFile;
    console.log(edges);
    return (
      <div className="wrapper" onClick={this.showNextImage}>
        <GatsbyImage
          fixed={edges[this.state.image].node.childImageSharp.fixed}
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
            fixed(width: 600, height: 600) {
              ...GatsbyImageSharpFixed_withWebp
            }
          }
        }
      }
    }
  }
`;
