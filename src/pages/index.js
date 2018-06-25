import React from 'react';
import { graphql } from 'gatsby';

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

    return (
      <div className="wrapper" onClick={this.showNextImage}>
        <img
          src={edges[this.state.image].node.childImageSharp.fluid.src}
          alt="Enzo!"
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
            fluid(maxWidth: 600) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
