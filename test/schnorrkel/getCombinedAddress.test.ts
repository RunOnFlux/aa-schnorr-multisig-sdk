import { Schnorrkel } from "../../src/signers"
import { generateRandomKeys } from "../../src/core"

describe("testing getCombinedAddress", () => {
  it("should get combined address", () => {
    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()

    const combinedAddress = Schnorrkel.getCombinedAddress([keyPairOne.publicKey, keyPairTwo.publicKey])
    expect(combinedAddress).toBeDefined
    expect(typeof combinedAddress).toBe("string")
  })

  it("should requires two public keys or more", () => {
    const keyPair = generateRandomKeys()

    expect(() => Schnorrkel.getCombinedAddress([keyPair.publicKey])).toThrow("At least 2 public keys should be provided")
  })
})
