import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';

import './style.css';

export default class extends React.Component {
  state = {
    imageIndex: 0,
    image: this.props.data.allFile.edges[0].node.childImageSharp.fluid,
    barks: -1,
    loaded: false
  };

  componentDidMount() {
    this.audio = [1, 2, 3, 4, 5].map(number => new Audio(`/bark${number}.mp3`));
    this.barks = [...this.audio];

    // preload images
    this.props.data.allFile.edges.forEach((edge, i) => {
      let image = new Image();
      image.src = edge.node.childImageSharp.fluid.src;

      if (i === 0) {
        image.onload = () => {
          this.setState({ loaded: true });
        };
      }
    });

    this.getFavicon();

    document.addEventListener('keydown', this.handleKeyDown, true);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }

  handleKeyDown = event => {
    switch (event.key) {
      case 'ArrowLeft':
        return this.nextImage(-1);
      case 'ArrowRight':
        return this.nextImage(1);
      default:
        return;
    }
  };

  bark = () => {
    if (!this.barks.length) {
      this.barks = [...this.audio];
    }

    this.setState(prevState => ({ barks: prevState.barks + 1 }));
    const bark = this.barks.splice(Math.floor(Math.random() * this.barks.length), 1);
    bark[0].cloneNode().play();
  };

  nextImage = (delta = 1) => {
    this.bark();

    this.setState(prevState => {
      const next = prevState.imageIndex + delta;
      const lastImage = this.props.data.allFile.edges.length - 1;
      let imageIndex;

      if (delta > 0) {
        imageIndex = next > lastImage ? 0 : next;
      } else {
        imageIndex = next < 0 ? lastImage : next;
      }

      return {
        imageIndex,
        image: this.props.data.allFile.edges[imageIndex].node.childImageSharp.fluid
      };
    });

    this.getFavicon();
  };

  getFavicon = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');

    const image = new Image();

    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      const favicon = canvas.toDataURL('image/x-icon');
      this.setState({ favicon });
    };

    image.src = this.state.image.base64;
  };

  render() {
    const { loaded, barks, image, favicon } = this.state;

    return (
      <div className="wrapper" onClick={() => this.nextImage()}>
        <Helmet>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          {favicon && <link rel="shortcut icon" type="image/x-icon" href={favicon} />}
          {barks >= 0 && (
            <title>
              {Array.from({ length: (barks % 3) + 1 }, (_, i) => i)
                .map(num => 'bark')
                .join(' ')}
            </title>
          )}
        </Helmet>
        <div className="background" style={{ backgroundImage: `url(${image.base64})` }} />
        <img src={image.src} alt="Enzo!" style={{ opacity: loaded ? 1 : 0 }} />
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
              src
            }
          }
        }
      }
    }
  }
`;
