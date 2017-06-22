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
    history: [],
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
        history: [...state.history, coords],
        updates: state.updates + 1,
      }));
    });
  }

  render() {
    const { distance, history, started, updates } = this.state;

    return (
      <div className="Wrapper">
        <div className="App">
          <div className="Tracker">
            <dl>
              <dt>Time</dt>
              <dd>00:00:00 (<span role="img" aria-label="Soon!">👷</span>)</dd>
              <dt>Distance</dt>
              <dd>{distance} km</dd>
              <dt>Positions tracked</dt>
              <dd>{updates}</dd>
            </dl>
            <div>
              <button onClick={this.onStartStop} className={started ? 'started' : undefined}>
                <span>{started ? 'Stop' : 'Start'}</span>
                <span className={`border${started ? ' started' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        <ul>
          {history.map(item => (
            <li>
              <div>Lat: {item.latitude}</div>
              <div>Lng: {item.longitude}</div>
            </li>
          ))}
        </ul>

      </div>
    );
  }
}

export default App;
