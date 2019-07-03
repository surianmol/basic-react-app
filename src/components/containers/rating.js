import React, { Component } from "react";

class Rating extends Component {
  state = {};

  render() {
    var stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <label key={i} className={i < this.props.value ? "selected" : ""}>
          ★
        </label>
      );
    }

    return <div className="star-rating">{stars}</div>;
  }
}

export default Rating;
