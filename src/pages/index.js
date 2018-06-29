import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import muzzle from 'lodash/throttle';

import './style.css';

export default class extends React.Component {
  static defaultProps = {
    barkDelay: 200
  };

  state = {
    imageIndex: 0,
    barkCount: -1,
    firstImageLoaded: false
  };

  componentDidMount() {
    // create the audio sources for each bark file
    this.audio = this.props.data.audio.edges.map(
      edge => new Audio(edge.node.publicURL)
    );

    // create a clone of the array that we will splice from to ensure unique barks
    this.barks = [...this.audio];

    // bark after the page has been loaded for 1 second
    setTimeout(this.bark, 1000);

    // preload images
    this.props.data.images.edges.forEach((edge, i) => {
      let image = new Image();
      image.src = edge.node.childImageSharp.resize.src;

      // once the first images is loaded set a flag to fade it in
      if (i === 0) {
        image.onload = () => {
          this.setState({ firstImageLoaded: true });
        };
      }
    });

    document.addEventListener('keydown', this.handleKeyDown, true);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }

  bark = () => {
    // log the bark event to google analytics
    if (window.ga) {
      window.ga('send', 'event', 'bark', 'bark');
    }

    // pull a random bark from the remaining barks
    const bark = this.barks.splice(
      Math.floor(Math.random() * this.barks.length),
      1
    );

    // clone the bark so multiple barks can play simultaneously
    bark[0].cloneNode().play();

    // increment the bark count
    this.setState(prevState => ({ barkCount: prevState.barkCount + 1 }));

    // if we run out of barks, refresh the array
    // from the saved set of audio objects
    if (!this.barks.length) {
      this.barks = [...this.audio];
    }
  };

  changeImage = (delta = 1) => {
    this.bark();

    this.setState(prevState => {
      const next = prevState.imageIndex + delta;
      const lastImage = this.props.data.images.edges.length - 1;
      let imageIndex;

      if (delta > 0) {
        imageIndex = next > lastImage ? 0 : next;
      } else {
        imageIndex = next < 0 ? lastImage : next;
      }

      return { imageIndex };
    });
  };

  throttledChangeImage = muzzle(this.changeImage, this.props.barkDelay);

  handleKeyDown = event => {
    switch (event.key) {
      case 'a':
      case 'ArrowLeft':
        return this.throttledChangeImage(-1);
      case 'Enter':
      case ' ':
      case 'd':
      case 'ArrowRight':
        return this.throttledChangeImage();
      default:
        return;
    }
  };

  currentImage = () =>
    this.props.data.images.edges[this.state.imageIndex].node.childImageSharp
      .resize;

  renderHead = () => {
    const { barkCount } = this.state;
    const titleBarks = (barkCount % 3) + 1;

    const {
      site: { siteMetadata }
    } = this.props.data;

    return (
      <Helmet>
        {barkCount === -1 ? (
          <title>{siteMetadata.title}</title>
        ) : (
          <title>
            {Array(titleBarks)
              .fill('bark')
              .join(' ')}
          </title>
        )}
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link key="icon" rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="description" content={siteMetadata.description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={siteMetadata.twitter} />
        <meta name="twitter:creator" content={siteMetadata.twitter} />
        <meta property="og:url" content={siteMetadata.url} />
        <meta property="og:title" content={siteMetadata.title} />
        <meta property="og:description" content={siteMetadata.description} />
        <meta
          property="og:image"
          content={`${siteMetadata.url}${this.currentImage().src}`}
        />
      </Helmet>
    );
  };

  render() {
    const image = this.currentImage();

    return (
      <div className="wrapper" onClick={() => this.throttledChangeImage()}>
        {this.renderHead()}
        <div
          className="background"
          style={{ backgroundImage: `url(${image.src})` }}
        />
        <img
          src={image.src}
          alt="Enzo!"
          style={{ opacity: this.state.firstImageLoaded ? 1 : 0 }}
        />
      </div>
    );
  }
}

export const PageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        url
        title
        description
        twitter
      }
    }
    images: allFile(filter: { sourceInstanceName: { eq: "images" } }) {
      edges {
        node {
          childImageSharp {
            resize(width: 600, quality: 75) {
              src
            }
          }
        }
      }
    }
    audio: allFile(filter: { sourceInstanceName: { eq: "audio" } }) {
      edges {
        node {
          publicURL
        }
      }
    }
  }
`;
