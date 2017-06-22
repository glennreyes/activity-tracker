import './App.css';

import React, { Component } from 'react';


const toRad = (value) => value * Math.PI / 180;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const latDifferenceInRad = toRad(lat2 - lat1);
  const lngDifferenceInRad = toRad(lon2 - lon1);
  const a =
    Math.sin(latDifferenceInRad / 2) * Math.sin(latDifferenceInRad / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(lngDifferenceInRad / 2) * Math.sin(lngDifferenceInRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

class App extends Component {
  state = {
    started: false,
    distance: 0,
    coords: null,
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.setState({ coords });
      });
    }
  }

  onStartStop = () => {
    this.setState(({ started }) => ({
      started: !started,
    }));

    navigator.geolocation.watchPosition(({ coords }) => {
      const { coords: prevCoords } = this.state;
      const distance = calculateDistance(
        prevCoords.latitude,
        prevCoords.longitude,
        coords.latitude,
        coords.longitude,
      );
      this.setState({ coords, distance });
    });
  }

  render() {
    const { coords, currentCoords, distance, started } = this.state
    return (
      <div className="App">
        <div className="App-header">
          <h2>Activity tracker</h2>
          {coords ? (
            <div>
              <button onClick={this.onStartStop}>{started ? 'Stop' : 'Start'}</button>
              {currentCoords && (
                <h1>Distance: {distance} km</h1>
              )}
            </div>
          ) : <div>Loading tracker ...</div>}
        </div>
      </div>
    );
  }
}

export default App;
