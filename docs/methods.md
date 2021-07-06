## Methods

API call return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Resolve is guaranteed to get called
with a `result` object, even if user closes the window, network connection times
out, etc. In case of failure `result.success` is set to false and `result.payload.error` is
the error message. It is recommended to log the error message and let user
restart the action.

Every method require an [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) with combination of [`common`](methods/commonParams.md) fields and method specific fields.

* [OneKeyConnect.getPublicKey](methods/getPublicKey.md)
* [OneKeyConnect.requestLogin](methods/requestLogin.md)
* [OneKeyConnect.cipherKeyValue](methods/cipherKeyValue.md)
* [OneKeyConnect.wipeDevice](methods/wipeDevice.md)
* [OneKeyConnect.resetDevice](methods/resetDevice.md)
* [OneKeyConnect.getCoinInfo](methods/getCoinInfo.md)

### Bitcoin, Bitcoin Cash, Bitcoin Gold, Litecoin, Dash, ZCash, Testnet

* [OneKeyConnect.getAddress](methods/getAddress.md)
* [OneKeyConnect.getAccountInfo](methods/getAccountInfo.md)
* [OneKeyConnect.composeTransaction](methods/composeTransaction.md)
* [OneKeyConnect.signTransaction](methods/signTransaction.md)
* [OneKeyConnect.pushTransaction](methods/pushTransaction.md)
* [OneKeyConnect.signMessage](methods/signMessage.md)
* [OneKeyConnect.verifyMessage](methods/verifyMessage.md)

### Ethereum
* [OneKeyConnect.ethereumGetAddress](methods/ethereumGetAddress.md)
* [OneKeyConnect.ethereumSignTransaction](methods/ethereumSignTransaction.md)
* [OneKeyConnect.ethereumSignMessage](methods/ethereumSignMessage.md)
* [OneKeyConnect.ethereumVerifyMessage](methods/ethereumVerifyMessage.md)

### Eos
* [OneKeyConnect.eosGetPublicKey](methods/eosGetPublicKey.md)
* [OneKeyConnect.eosSignTransaction](methods/eosSignTransaction.md)

### NEM
* [OneKeyConnect.nemGetAddress](methods/nemGetAddress.md)
* [OneKeyConnect.nemSignTransaction](methods/nemSignTransaction.md)

### Stellar
* [OneKeyConnect.stellarGetAddress](methods/stellarGetAddress.md)
* [OneKeyConnect.stellarSignTransaction](methods/stellarSignTransaction.md)

### Lisk
* [OneKeyConnect.liskGetAddress](methods/liskGetAddress.md)
* [OneKeyConnect.liskSignMessage](methods/liskSignMessage.md)
* [OneKeyConnect.liskVerifyMessage](methods/liskVerifyMessage.md)
* [OneKeyConnect.liskSignTransaction](methods/liskSignTransaction.md)

### Cardano
* [OneKeyConnect.cardanoGetPublicKey](methods/cardanoGetPublicKey.md)
* [OneKeyConnect.cardanoGetAddress](methods/cardanoGetAddress.md)
* [OneKeyConnect.cardanoSignTransaction](methods/cardanoSignTransaction.md)

### Ripple
* [OneKeyConnect.rippleGetAddress](methods/rippleGetAddress.md)
* [OneKeyConnect.rippleSignTransaction](methods/rippleSignTransaction.md)

### Tezos
* [OneKeyConnect.tezosGetAddress](methods/tezosGetAddress.md)
* [OneKeyConnect.tezosGetPublicKey](methods/tezosGetPublicKey.md)
* [OneKeyConnect.tezosSignTransaction](methods/tezosSignTransaction.md)

### Binance
* [OneKeyConnect.binanceGetAddress](methods/binanceGetAddress.md)
* [OneKeyConnect.binanceGetPublicKey](methods/binanceGetPublicKey.md)
* [OneKeyConnect.binanceSignTransaction](methods/binanceSignTransaction.md)
