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
    updates: 0,
  }

  onStartStop = () => {
    if (!navigator.geolocation) {
      alert('You need geolocation support for this!');
      return;
    }

    this.setState(({ started }) => ({
      started: !started,
    }));

    navigator.geolocation.watchPosition(({ coords }) => {
      const { coords: prevCoords } = this.state;

      if (!prevCoords) {
        this.setState({ coords });
        return;
      }

      const distance = calculateDistance(
        prevCoords.latitude,
        prevCoords.longitude,
        coords.latitude,
        coords.longitude,
      );

      this.setState(state => ({
        coords,
        distance,
        updates: state.updates + 1,
      }));
    });
  }

  render() {
    const { coords, distance, started, updates } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Activity tracker</h2>
          <div>
            <button onClick={this.onStartStop}>{started ? 'Stop' : 'Start'}</button>
            {started && (
              <div>
                <h3>Distance: {distance} km</h3>
                <h3>Updates: {updates}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
