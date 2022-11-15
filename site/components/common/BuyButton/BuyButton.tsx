import React from 'react'
import { Wallet } from '@harmonicpool/cardano-wallet-interface'

const sendData = {
  address:
    'addr1q90r89rh3s59vclvh4h8zv0uufctafpjsu6lwy64uddc8td09qthx9c5j95wnehlcz32uvwumfkkz7fpj547q2d6xm2q0lzjnx',
  amount: 1,
}

export default class Home extends React.Component<
  {},
  { address: {}; NamiHasBeenInitialized: boolean }
> {
  constructor(props: {} | Readonly<{}>) {
    super(props)

    // set your key once then you are free to go
    Wallet.setBlockfrost('testnetWS8ic2FQlQxLBK0m58WVhe5e4dKgaQBp')

    this.state = {
      address: {},
      NamiHasBeenInitialized: false,
    }
  }

  async componentDidMount() {
    await Wallet.enable(Wallet.Names.Nami)
    // now Wallet.Nami is accessible

    this.setState({
      address: await Wallet.Nami.getCurrentUserDelegation(),
      NamiHasBeenInitialized: true,
    })
  }

  /* async initiate() {
    let txHash = await Wallet.Nami.signTransaction(sendData)
    alert(txHash)
  }*/

  render() {
    return (
      <div>
        {!this.state.NamiHasBeenInitialized ? (
          <p style={txtSty}>looking for Nami... 👀</p>
        ) : this.state.address ===
          'addr1q90r89rh3s59vclvh4h8zv0uufctafpjsu6lwy64uddc8td09qthx9c5j95wnehlcz32uvwumfkkz7fpj547q2d6xm2q0lzjnx' ? (
          <p style={txtSty}>Thank you for your support &#9829;</p>
        ) : (
          <button onClick={() => this.componentDidMount()}>
            Buy With Cardano
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
