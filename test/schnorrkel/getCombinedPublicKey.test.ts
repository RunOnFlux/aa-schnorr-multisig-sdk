import { Schnorrkel } from "../../src/signers"
import { Key } from "../../src/types"
import { generateRandomKeys } from "../../src/core"

describe("testing getCombinedPublicKey", () => {
  it("should get combined public key", () => {
    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()

    const combinedPublicKey = Schnorrkel.getCombinedPublicKey([keyPairOne.publicKey, keyPairTwo.publicKey])
    expect(combinedPublicKey).toBeDefined
    expect(combinedPublicKey).toBeInstanceOf(Key)
    expect(combinedPublicKey.toHex()).toHaveLength(66)
  })

  it("should get same combined public key", () => {
    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()

    const combinedPublicKey = Schnorrkel.getCombinedPublicKey([keyPairOne.publicKey, keyPairTwo.publicKey])
    const combinedPublicKeyTwo = Schnorrkel.getCombinedPublicKey([keyPairTwo.publicKey, keyPairOne.publicKey])

    expect(combinedPublicKey.toHex()).toEqual(combinedPublicKeyTwo.toHex())
  })

  it("should get same combined public key with different order", () => {
    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()

    const combinedPublicKey = Schnorrkel.getCombinedPublicKey([keyPairOne.publicKey, keyPairTwo.publicKey])
    const combinedPublicKeyTwo = Schnorrkel.getCombinedPublicKey([keyPairTwo.publicKey, keyPairOne.publicKey])

    expect(combinedPublicKey.toHex()).toEqual(combinedPublicKeyTwo.toHex())
  })

  it("should get combined public key that is different from the original public keys", () => {
    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()

    const combinedPublicKey = Schnorrkel.getCombinedPublicKey([keyPairOne.publicKey, keyPairTwo.publicKey])
    expect(combinedPublicKey.toHex()).not.toEqual(keyPairOne.publicKey.toHex())
    expect(combinedPublicKey.toHex()).not.toEqual(keyPairTwo.publicKey.toHex())
  })

  it("should requires two public keys or more", () => {
    const keyPair = generateRandomKeys()

    expect(() => Schnorrkel.getCombinedPublicKey([keyPair.publicKey])).toThrow("At least 2 public keys should be provided")
  })
})
