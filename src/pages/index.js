import React from 'react';
import { graphql } from 'gatsby';

import './style.css';

export default class extends React.Component {
  state = {
    image: 0,
    loaded: false
  };

  componentDidMount() {
    this.audio = new Audio('/bark.mp3');

    // preload images
    this.props.data.allFile.edges.forEach((edge, i) => {
      let image = new Image();
      image.src = edge.node.childImageSharp.fluid.srcWebp;

      if (i === 0) {
        image.onload = () => {
          this.setState({ loaded: true });
        };
      }
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
    this.audio.cloneNode().play();
  };

  previousImage = () => {
    this.bark();

    this.setState(prevState => {
      const prev = prevState.image - 1;
      const image = prev < 0 ? this.props.data.allFile.edges.length - 1 : prev;
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
    const image = this.props.data.allFile.edges[this.state.image].node
      .childImageSharp.fluid;

    return (
      <div className="wrapper" onClick={this.nextImage}>
        <div
          className="background"
          style={{ backgroundImage: `url(${image.base64})` }}
        />
        <img
          src={image.srcWebp}
          srcSet={image.srcSet}
          sizes={image.sizes}
          alt="Enzo!"
          style={{ opacity: this.state.loaded ? 1 : 0 }}
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
