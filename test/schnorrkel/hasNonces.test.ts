import { Schnorrkel } from "../../src/signers"
import { _hashPrivateKey, generateRandomKeys } from "../../src/core"

describe("testing hasNonces", () => {
  it("should check if there are nonces set before manipulating them", () => {
    const schnorrkel = new Schnorrkel()

    const keyPair = generateRandomKeys()
    expect(schnorrkel.hasNoncePairs(keyPair.privateKey)).toEqual(false)
    schnorrkel.generatePublicNonces(keyPair.privateKey)
    expect(schnorrkel.hasNoncePairs(keyPair.privateKey)).toEqual(true)
  })
})
