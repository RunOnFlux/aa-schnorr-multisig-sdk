import { _hashPrivateKey, generateRandomKeys } from "../../src/core"
import { Schnorrkel } from "../../src/signers"

describe("testing generatePublicNonces", () => {
  it("should generate public nonces", () => {
    const schnorrkel = new Schnorrkel()
    const keyPair = generateRandomKeys()
    const publicNonces = schnorrkel.generatePublicNonces(keyPair.privateKey)
    expect(publicNonces).toBeDefined
    expect(publicNonces.kPublic).toBeDefined
    expect(publicNonces.kTwoPublic).toBeDefined
    expect(publicNonces.kPublic.buffer).toHaveLength(33)
    expect(publicNonces.kTwoPublic.buffer).toHaveLength(33)
  })
})
