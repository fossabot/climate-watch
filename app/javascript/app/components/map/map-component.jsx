import React, { Component } from 'react';
import Proptypes from 'prop-types';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps';
import { Motion, spring } from 'react-motion';

import styles from './map-styles.scss';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: props.initial.center,
      zoom: props.initial.zoom
    };
  }

  handleZoomIn = () => {
    this.setState({
      zoom: this.state.zoom * 2
    });
  };

  handleZoomOut = () => {
    const { zoom } = this.state;
    if (zoom > 1) {
      this.setState({
        zoom: zoom / 2
      });
    }
  };

  render() {
    const { zoom, center } = this.state;
    const { paths, zoomEnable, dragEnable } = this.props;
    return (
      <div className={styles.wrapper}>
        {zoomEnable &&
          <div className={styles.actions}>
            <button onClick={this.handleZoomIn}>+</button>
            <button disabled={zoom === 1} onClick={this.handleZoomOut}>
              -
            </button>
          </div>}
        <Motion
          defaultStyle={{
            z: 1,
            x: 0,
            y: 20
          }}
          style={{
            z: spring(zoom, { stiffness: 240, damping: 30 }),
            x: spring(center[0], { stiffness: 240, damping: 30 }),
            y: spring(center[1], { stiffness: 240, damping: 30 })
          }}
        >
          {({ z, x, y }) =>
            (<ComposableMap
              projection="robinson"
              style={{
                width: '100%',
                height: 'auto'
              }}
            >
              <ZoomableGroup
                center={[x, y]}
                zoom={z}
                disablePanning={!dragEnable}
              >
                <Geographies geographyPaths={paths}>
                  {(geographies, projection) =>
                    geographies.map(geography =>
                      (<Geography
                        key={geography.id}
                        geography={geography}
                        projection={projection}
                        style={{
                          default: {
                            fill: '#ECEFF1',
                            stroke: '#607D8B',
                            strokeWidth: 0.75,
                            outline: 'none'
                          },
                          hover: {
                            fill: '#607D8B',
                            stroke: '#607D8B',
                            strokeWidth: 0.75,
                            outline: 'none'
                          },
                          pressed: {
                            fill: '#FF5722',
                            stroke: '#607D8B',
                            strokeWidth: 0.75,
                            outline: 'none'
                          }
                        }}
                      />)
                    )}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>)}
        </Motion>
      </div>
    );
  }
}

Map.propTypes = {
  zoomEnable: Proptypes.bool,
  dragEnable: Proptypes.bool,
  initial: Proptypes.shape({
    center: Proptypes.array,
    zoom: Proptypes.number
  }),
  paths: Proptypes.array.isRequired
};

Map.defaultProps = {
  zoomEnable: false,
  dragEnable: true,
  initial: {
    center: [0, 20],
    zoom: 1
  },
  paths: []
};

export default Map;
