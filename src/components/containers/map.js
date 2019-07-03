import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import MapMarker from "./map-marker";
import Rating from "./rating";

const GOOGLE_MAP_API_KEY = "";

class Map extends Component {
  state = {
    markers: [
      {
        position: {
          lat: 18.556842,
          lng: 73.79036
        },
        id: 1,
        title: "Baner Park",
        rating: 5
      },
      {
        position: {
          lat: 18.66,
          lng: 73.79036
        },
        id: 2,
        title: "Pune Park",
        rating: 3
      },
      {
        position: {
          lat: 18.6,
          lng: 73.89036
        },
        id: 3,
        title: "Aundh Park",
        rating: 2
      },
      {
        position: {
          lat: 18.2,
          lng: 73.80036
        },
        id: 4,
        title: "SF Park",
        rating: 3
      },
      {
        position: {
          lat: 18.4,
          lng: 73.80036
        },
        id: 5,
        title: "MH Park",
        rating: 1
      }
    ]
  };

  onMouseEvent = (id, enter) => {
    this.setState(state => {
      let markers = [];
      state.markers.forEach(element => {
        if (element.id === id) {
          element.hover = enter;
        }

        markers.push(element);
      });

      return { markers };
    });
  };

  render() {
    return (
      <div className="map-container">
        <div className="table">
          <div className="main">Results</div>
          {this.state.markers.map(item => {
            return (
              <div
                className={`name ${item.hover ? "hover" : ""}`}
                key={item.id}
                onMouseEnter={() => {
                  this.onMouseEvent(item.id, true);
                }}
                onMouseLeave={() => {
                  this.onMouseEvent(item.id, false);
                }}
              >
                <div className="title">{item.title}</div>
                <Rating value={item.rating} />
                <div className="lat-long">
                  {item.position.lat}, {item.position.lng}
                </div>
              </div>
            );
          })}
        </div>
        <div className="map">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: GOOGLE_MAP_API_KEY,
              language: "en-us"
            }}
            defaultCenter={{
              lat: 18.51,
              lng: 73.85
            }}
            defaultZoom={10}
          >
            {this.state.markers.map(item => {
              return (
                <MapMarker
                  key={item.id}
                  lat={item.position.lat}
                  lng={item.position.lng}
                  text={item.title}
                  hover={item.hover}
                  rating={item.rating}
                  onMouseEnter={() => {
                    this.onMouseEvent(item.id, true);
                  }}
                  onMouseLeave={() => {
                    this.onMouseEvent(item.id, false);
                  }}
                />
              );
            })}
            {/*  */}
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}

export default Map;
