import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';

import './style.css';

export default class extends React.Component {
  state = {
    image: 0,
    barks: 0,
    loaded: false
  };

  componentDidMount() {
    this.audio = new Audio('/bark.mp3');

    // preload images
    this.getImages().forEach((edge, i) => {
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
    this.setState(prevState => ({ barks: prevState.barks + 1 }));
    this.audio.cloneNode().play();
  };

  getImages = () => this.props.data.allFile.edges;

  previousImage = () => {
    this.bark();

    this.setState(prevState => {
      const prev = prevState.image - 1;
      const image = prev < 0 ? this.getImages().length - 1 : prev;
      return { image };
    });
  };

  nextImage = () => {
    this.bark();

    this.setState(prevState => {
      const next = prevState.image + 1;
      const image = next > this.getImages().length - 1 ? 0 : next;
      return { image };
    });
  };

  render() {
    const { loaded, barks } = this.state;
    const image = this.getImages()[this.state.image].node.childImageSharp.fluid;

    return (
      <div className="wrapper" onClick={this.nextImage}>
        {barks > 0 && (
          <Helmet>
            <title>
              {Array.from({ length: (barks % 3) + 1 }, (_, i) => i)
                .map(num => 'bark')
                .join(' ')}
            </title>
          </Helmet>
        )}
        <div
          className="background"
          style={{ backgroundImage: `url(${image.base64})` }}
        />
        <img
          src={image.srcWebp}
          alt="Enzo!"
          style={{ opacity: loaded ? 1 : 0 }}
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
              base64
              srcWebp
            }
          }
        }
      }
    }
  }
`;
