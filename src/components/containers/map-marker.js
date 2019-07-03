import React, { Component } from "react";
import Rating from "./rating";

class MapMarker extends Component {
  state = {
    clicked: false
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleClick = e => {
    if (this.ref.current.contains(e.target)) {
      this.setState({ clicked: true });
    } else {
      this.setState({ clicked: false });
    }
  };

  componentDidMount = () => {
    document.addEventListener("click", this.handleClick, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener("click", this.handleClick, false);
  };

  render() {
    let dimention = 20;
    let className = "";

    if (this.props.hover) {
      dimention = 40;
    }

    if (this.state.clicked === true) {
      dimention = 100;
      className = "clicked";
    }

    const style = {
      position: "absolute",
      width: dimention,
      height: dimention,
      left: -dimention / 2,
      top: -dimention / 2,
      border: "5px solid #f44336",
      borderRadius: !className ? dimention : "",
      backgroundColor: "white",
      textAlign: !className ? "center" : "",
      padding: 4
    };

    return (
      <div
        ref={this.ref}
        style={style}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        className={className}
      >
        <div style={{ color: "#282c34", padding: this.state.clicked ? 4 : 0 }}>
          {this.props.text}
        </div>
        {this.state.clicked ? (
          <React.Fragment>
            <Rating value={this.props.rating} />{" "}
            <div className="lat-long">
              {this.props.lat}, {this.props.lng}
            </div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default MapMarker;
