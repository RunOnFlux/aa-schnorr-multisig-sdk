# Account Abstraction Schnorr Signatures
A typescript library for creating ERC-4337 Account Abstraction which utilizes Schnorr Signatures for multi signatures.


## Key features
* ERC-4337 Account Abstraction
  * `MultiSigAccountAbstraction` class extends [Alchemys's](https://github.com/alchemyplatform/aa-sdk/tree/main/packages/core) `BaseSmartContractAccount`. It allows to interact with Smart Contract Account.
  * `MultiSigAccountSigner` class extends [Alchemys's](https://github.com/alchemyplatform/aa-sdk/tree/main/packages/ethers) `Account Signer` and is designed to build and send user operations.
* Schnorr Signatures
  * `Schnorkell` is the key element of the package. It manages signature's nonces and has methods for signing messeges, like: `sign()` and `multiSigSign()`.
  * `SchnorrSigner` extends `Schnorkell` and manages key pairs (private and public) to generate Schnorr Signatures.
  * `SchnorrMultiSigTx` class has te be used to create single multi-signature transaction. Signers, User Operation Hash and User Operation Request data have to be known upfront to initialize transaction signing process.

## Requirements:

* Node: >=18.0.0, <20.0.0
* npm (Node.js package manager): v9.x.x

## Installation

```
git clone https://github.com/RunOnFlux/aa-schnorr-multisig-sdk.git
cd aa-schnorr-multisig-sdk
npm i
```

### Testing
```
npm run test
```

## Important notice

***Before signing any multi-sig transaction signers have to exchange their `publicKey` and `publicNonces`. Nonces are one-time generated random numbers used to validate the signature. It's absolutely crucial to delete the nonces once a signature has been crafted with them. Nonce reuse will lead to private key leakage!***

## Example usage
1. Create Schnorr Signer(s) out of private key. **Remember! Never share your private key!**
```
const signer1 = createSchnorrSigner(hexToBytes(PRIVATE_KEY))
const signer2 = createSchnorrSigner(hexToBytes(PRIVATE_KEY))
```

2. Create User Operation CallData. In this example `UserOperationCallData` is encoded with ERC20's `transfer` function.
```
const uoCallData: UserOperationCallData = encodeFunctionData({
        abi: ERC20_abi,
        args: [toAddress, amount],
        functionName: "transfer",
      })
```

3. Build User Operation. Use `MultiSigAccountSigner`'s method with gas estimator `buildUserOpWithGasEstimator()`.
```
const { opHash, request } = await multiSigAccountSigner.buildUserOpWithGasEstimator(
  {
    data: uoCallData,
    target: targetAddress as Hex,
  },
  {
    preVerificationGas: 2000000,
  }
)
```

4. Initialize Multi-Sig Schnorr Transaction.
```
const msTx = new SchnorrMultiSigTx([signer1, signer2], opHash, request)
```

5. Sign the transaction with every defined signer.
```
msTx.signMultiSigHash(signer)
```

6. Send the transaction with `MultiSigAccountSigner`'s method `sendMultiSigTransaction()`.
```
const txHash = await multiSigAccountSigner.sendMultiSigTransaction(msTx)
```