import React from 'react';
import { graphql } from 'gatsby';

import './style.css';

export default class extends React.Component {
  state = {
    image: 0
  };

  componentDidMount() {
    // preload images
    this.props.data.allFile.edges.forEach(({ node }) => {
      let image = new Image();
      image.src = node.childImageSharp.fluid.src;
    });

    document.addEventListener('keydown', this.handleKeyDown, true);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }

  handleKeyDown = event => {
    switch (event.key) {
      case 'ArrowLeft':
        return this.previousImage();
      case 'ArrowRight':
        return this.nextImage();
      default:
        return;
    }
  };

  bark = () => {
    const audio = new Audio('/bark.wav');
    audio.play();
  };

  previousImage = () => {
    this.bark();

    this.setState(prevState => {
      const previous = prevState.image - 1;

      const image =
        previous < 0 ? this.props.data.allFile.edges.length - 1 : previous;

      return { image };
    });
  };

  nextImage = () => {
    this.bark();

    this.setState(prevState => {
      const next = prevState.image + 1;

      const image = next > this.props.data.allFile.edges.length - 1 ? 0 : next;

      return { image };
    });
  };

  render() {
    const { edges } = this.props.data.allFile;

    return (
      <div className="wrapper" onClick={this.nextImage}>
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
