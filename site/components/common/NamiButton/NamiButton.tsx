import React from 'react'
import { Wallet } from '@harmonicpool/cardano-wallet-interface'

export default class Home extends React.Component<
  {},
  { currentDelegation: {}; NamiHasBeenInitialized: boolean }
> {
  constructor(props: {} | Readonly<{}>) {
    super(props)

    // set your key once then you are free to go
    Wallet.setBlockfrost('testnetWS8ic2FQlQxLBK0m58WVhe5e4dKgaQBp')

    this.state = {
      currentDelegation: {},
      NamiHasBeenInitialized: false,
    }
  }

  async componentDidMount() {
    await Wallet.enable(Wallet.Names.Nami)
    // now Wallet.Nami is accessible

    this.setState({
      currentDelegation: await Wallet.Nami.getCurrentUserDelegation(),
      NamiHasBeenInitialized: true,
    })
  }

  render() {
    return (
      <div>
        {!this.state.NamiHasBeenInitialized ? (
          <p style={txtSty}>looking for Nami... 👀</p>
        ) : (
          <button onClick={() => Wallet.enable(Wallet.Names.Nami)}>
            Connect
          </button>
        )}
      </div>
    )
  }
}

const containerSty = {
  position: 'absolute',
  height: '100vh',
  width: '100vw',
  top: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const txtSty = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '5vh',
}
