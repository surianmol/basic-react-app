import React, { Component } from "react";

/**
 * This component is a wrapper over html input.
 *
 * Input Props:
 * onChange: (event) => {}
 * isValid: (value) = {returns if true if value is valid}
 * onValidityChange: (event, isValid) => {}
 * required: boolean
 * type: input type
 * label: Field Label
 * placeHolder: Field Place holder
 * value: field value
 * focus: boolean
 * disabled: boolean
 * name: field name
 * labelInfo: will show info Icon on label with message as tooltip
 * iconClass: icon for field
 */
class FormInput extends Component {
  state = {
    errorMessage: "",
    passwordState: true
  };

  /**
   * Call the onChange property and sets the state.
   */
  handleValueChange = event => {
    if (this.state.errorMessage) {
      this.handleBlur(event);
    }

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  /**
   * blur handler for validation.
   */
  handleBlur = event => {
    const { value } = event.target;
    let errorMessage = "";

    // Check for empty value.
    if (this.props.required && !value) {
      errorMessage = "Enter a valid value";
    } else if (this.props.type === "email") {
      // Check for email regex.
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(value)) {
        errorMessage = "Enter a valid email id";
      }
    } else if (this.props.isValid) {
      // If isValid is passed in props call it.
      errorMessage = this.props.isValid(value);
    }

    if (this.props.onValidityChange) {
      this.props.onValidityChange(event, errorMessage ? false : true);
    }

    this.setState({ errorMessage });
  };

  togglePasswordVisibility = event => {
    this.setState(state => ({ passwordState: !state.passwordState }));
  };

  render() {
    const {
      type,
      label,
      required,
      placeHolder,
      focus,
      disabled,
      name,
      labelInfo,
      iconClass
    } = this.props;

    const error = this.state.errorMessage ? "error" : "";
    const inputType =
      type !== "password" ? type : this.state.passwordState ? type : "text";

    return (
      <div className="form-item">
        <label>
          {label} {label && required ? <span>*</span> : null}
          {labelInfo ? <div className="info" title={labelInfo} /> : null}
        </label>
        <input
          type={inputType}
          className={error + (type === "passwosadard" ? " view-password" : "")}
          placeholder={placeHolder}
          onChange={this.handleValueChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          autoFocus={focus}
          disabled={disabled}
          name={name}
        />
        {type === "password" ? (
          <div
            className="input-icon password"
            onClick={this.togglePasswordVisibility}
          />
        ) : iconClass ? (
          <div className={"input-icon " + iconClass} />
        ) : null}
        <div className="form-error-message">{this.state.errorMessage}</div>
      </div>
    );
  }
}

export default FormInput;
