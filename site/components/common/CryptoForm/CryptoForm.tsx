import React from 'react'
import 'ts-form-validation'

interface ShippingForm {
  Name: string
  email: string
  Address: string
  Zip: number
  City: string
  State: string
}

export default class App extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <div>
        <div className="container">
          <h1>Shipping</h1>
          <p>Please enter your shipping details.</p>
          <hr />
          <div className="form">
            <div className="fields fields--2">
              <label className="field">
                <span className="field__label">First name</span>
                <input
                  className="field__input"
                  type="text"
                  id="firstname"
                  value="John"
                />
              </label>
              <label className="field">
                <span className="field__label">Last name</span>
                <input
                  className="field__input"
                  type="text"
                  id="lastname"
                  value="Doe"
                />
              </label>
            </div>
            <label className="field">
              <span className="field__label">Address</span>
              <input className="field__input" type="text" id="address" />
            </label>
            <label className="field">
              <span className="field__label">Country</span>
              <select className="field__input" id="country">
                <option value=""></option>
                <option value="unitedstates">United States</option>
              </select>
            </label>
            <div className="fields fields--3">
              <label className="field">
                <span className="field__label">Zip code</span>
                <input className="field__input" type="text" id="zipcode" />
              </label>
              <label className="field">
                <span className="field__label">City</span>
                <input className="field__input" type="text" id="city" />
              </label>
              <label className="field">
                <span className="field__label">State</span>
                <select className="field__input" id="state">
                  <option value=""></option>
                </select>
              </label>
            </div>
          </div>
          <button className="button">Continue</button>
        </div>
      </div>
    )
  }
}
