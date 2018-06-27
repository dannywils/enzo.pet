import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import muzzle from 'lodash/throttle';

import './style.css';

export default class extends React.Component {
  state = {
    imageIndex: 0,
    barkCount: -1,
    firstImageLoaded: false
  };

  componentDidMount() {
    // create the audio sources for each bark file
    this.audio = this.props.data.audio.edges.map(edge => new Audio(edge.node.relativePath));

    // create a clone of the array that we will splice from to ensure unique barks
    this.barks = [...this.audio];

    // bark after the page has been loaded for 1 second
    setTimeout(this.bark, 1000);

    // preload images
    this.props.data.images.edges.forEach((edge, i) => {
      let image = new Image();
      image.src = edge.node.childImageSharp.fluid.src;

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

  handleKeyDown = event => {
    switch (event.key) {
      case 'a':
      case 'ArrowLeft':
        return this.nextImage(-1);
      case 'Enter':
      case ' ':
      case 'd':
      case 'ArrowRight':
        return this.nextImage(1);
      default:
        return;
    }
  };

  bark = () => {
    // log the bark event to google analytics
    if (window.ga) {
      window.ga('send', 'event', 'bark', 'bark');
    }

    // pull a random bark from the remaining barks
    const bark = this.barks.splice(Math.floor(Math.random() * this.barks.length), 1);

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

  // muzzle (throttle) the barking in case the user
  // holds the arrow keys or clicks fast
  muzzledBark = muzzle(this.bark, 350);

  nextImage = (delta = 1) => {
    this.muzzledBark();

    this.setState(prevState => {
      const next = prevState.imageIndex + delta;
      const lastImage = this.props.data.images.edges.length - 1;
      let imageIndex;

      if (delta > 0) {
        imageIndex = next > lastImage ? 0 : next;
      } else {
        imageIndex = next < 0 ? lastImage : next;
      }

      return {
        imageIndex,
        image: this.props.data.images.edges[imageIndex].node.childImageSharp.fluid
      };
    });
  };

  currentImage = () =>
    this.props.data.images.edges[this.state.imageIndex].node.childImageSharp.fluid;

  render() {
    const { firstImageLoaded, barkCount } = this.state;
    const image = this.currentImage();
    const titleBarks = (barkCount % 3) + 1;

    return (
      <div className="wrapper" onClick={() => this.nextImage()}>
        {barkCount >= 0 && (
          <Helmet>
            <title>
              {Array(titleBarks)
                .fill('bark')
                .join(' ')}
            </title>
          </Helmet>
        )}
        <div className="background" style={{ backgroundImage: `url(${image.base64})` }} />
        <img src={image.src} alt="Enzo!" style={{ opacity: firstImageLoaded ? 1 : 0 }} />
      </div>
    );
  }
}

export const PageQuery = graphql`
  query IndexQuery {
    images: allFile(filter: { sourceInstanceName: { eq: "images" } }) {
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
    audio: allFile(filter: { sourceInstanceName: { eq: "audio" } }) {
      edges {
        node {
          relativePath
        }
      }
    }
  }
`;
