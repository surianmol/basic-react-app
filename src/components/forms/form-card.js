import React, { Component } from "react";

/**
 * Stateless Form card component works as form container.
 */
class FormCard extends Component {
  state = {};
  render() {
    const style = {
      minHeight: this.props.height ? parseInt(this.props.height) : 400,
      width: this.props.width ? parseInt(this.props.width) : 350
    };
    return (
      <div className="form-card">
        {this.props.title ? (
          <div className="title">{this.props.title}</div>
        ) : null}
        <div className="main" style={style}>
          {this.props.children}
          {this.props.loadingText ? (
            <div className="mask">{this.props.loadingText}</div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default FormCard;
