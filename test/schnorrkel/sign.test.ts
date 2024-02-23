import { Schnorrkel } from "../../src/signers"
import { generateRandomKeys } from "../../src/core"
import { ethers } from "ethers"

describe("testing sign", () => {
  it("should sign a message", () => {
    const keyPair = generateRandomKeys()

    const msg = "test message"
    const signature = Schnorrkel.sign(keyPair.privateKey, msg)

    expect(signature).toBeDefined
    expect(signature.finalPublicNonce.buffer).toHaveLength(33)
    expect(signature.signature.buffer).toHaveLength(32)
    expect(signature.challenge.buffer).toHaveLength(32)
  })

  it("should sign a hash", () => {
    const keyPair = generateRandomKeys()

    const msg = "test message"
    const hash = ethers.utils.solidityKeccak256(["string"], [msg])
    const signature = Schnorrkel.signHash(keyPair.privateKey, hash)

    expect(signature).toBeDefined
    expect(signature.finalPublicNonce.buffer).toHaveLength(33)
    expect(signature.signature.buffer).toHaveLength(32)
    expect(signature.challenge.buffer).toHaveLength(32)
  })
})
