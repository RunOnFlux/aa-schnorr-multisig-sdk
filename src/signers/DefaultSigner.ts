import { generateRandomKeys } from "../core"
import { Schnorrkel } from "./Schnorrkel"
import { Key, PublicNonces, SignatureOutput } from "../types"
import { pubKey2Address } from "../helpers/schnorr-helpers"
const schnorrkel = new Schnorrkel()

export default class DefaultSigner {
  #privateKey: Key
  #publicKey: Key

  constructor(index: number) {
    const keys = generateRandomKeys()
    this.#privateKey = keys.privateKey
    this.#publicKey = keys.publicKey
  }

  getPublicKey(): Key {
    return this.#publicKey
  }

  getPublicNonces(): PublicNonces {
    return schnorrkel.generatePublicNonces(this.#privateKey)
  }

  getAddress(): string {
    return pubKey2Address(this.#publicKey)
  }

  multiSignMessage(msg: string, publicKeys: Key[], publicNonces: PublicNonces[]) {
    return schnorrkel.multiSigSign(this.#privateKey, msg, publicKeys, publicNonces)
  }

  signMessage(msg: string, hashFn: Function | null = null): SignatureOutput {
    return Schnorrkel.sign(this.#privateKey, msg, hashFn)
  }
}
