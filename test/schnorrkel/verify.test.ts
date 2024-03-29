import { _hashPrivateKey, generateRandomKeys } from "../../src/core"
import { ethers } from "ethers"
import { Key } from "../../src/types"
import { Schnorrkel } from "../../src/signers"

describe("testing verify", () => {
  it("should verify a normal schnorr signature and make sure sign does not overwrite the private key", () => {
    const privateKey = new Key(Buffer.from(ethers.utils.randomBytes(32)))

    const msg = "test message"
    const signature = Schnorrkel.sign(privateKey, msg)

    const publicKey = ethers.utils.arrayify(ethers.utils.computePublicKey(ethers.utils.computePublicKey(privateKey.buffer, false), true))

    expect(signature.finalPublicNonce.buffer).toHaveLength(33)
    expect(signature.signature.buffer).toHaveLength(32)
    expect(signature.challenge.buffer).toHaveLength(32)
    const result = Schnorrkel.verify(signature.signature, msg, signature.finalPublicNonce, new Key(Buffer.from(publicKey)))
    expect(result).toEqual(true)

    const secondMsg = "this is another msg"
    const secondSig = Schnorrkel.sign(privateKey, secondMsg)
    const secondRes = Schnorrkel.verify(secondSig.signature, secondMsg, secondSig.finalPublicNonce, new Key(Buffer.from(publicKey)))
    expect(secondRes).toEqual(true)
  })
  it("should sum signatures and verify them", () => {
    const schnorrkelOne = new Schnorrkel()
    const schnorrkelTwo = new Schnorrkel()

    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()
    const publicNoncesOne = schnorrkelOne.generatePublicNonces(keyPairOne.privateKey)
    const publicNoncesTwo = schnorrkelTwo.generatePublicNonces(keyPairTwo.privateKey)

    const publicNonces = [publicNoncesOne, publicNoncesTwo]
    const publicKeys = [keyPairOne.publicKey, keyPairTwo.publicKey]

    const combinedPublicKey = Schnorrkel.getCombinedPublicKey(publicKeys)

    const msg = "test message"
    const signatureOne = schnorrkelOne.multiSigSign(keyPairOne.privateKey, msg, publicKeys, publicNonces)
    const signatureTwo = schnorrkelTwo.multiSigSign(keyPairTwo.privateKey, msg, publicKeys, publicNonces)

    const signatures = [signatureOne.signature, signatureTwo.signature]
    const signaturesSummed = Schnorrkel.sumSigs(signatures)
    const result = Schnorrkel.verify(signaturesSummed, msg, signatureTwo.finalPublicNonce, combinedPublicKey)

    expect(result).toEqual(true)
  })
  it("should make sure private keys are not overwritten during signing", () => {
    const schnorrkelOne = new Schnorrkel()
    const schnorrkelTwo = new Schnorrkel()

    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()

    const publicNoncesOne = schnorrkelOne.generatePublicNonces(keyPairOne.privateKey)
    const publicNoncesTwo = schnorrkelTwo.generatePublicNonces(keyPairTwo.privateKey)

    const publicNonces = [publicNoncesOne, publicNoncesTwo]
    const publicKeys = [keyPairOne.publicKey, keyPairTwo.publicKey]

    const combinedPublicKey = Schnorrkel.getCombinedPublicKey(publicKeys)

    const msg = "test message"
    const pkOneCache = new Key(Buffer.from(keyPairOne.privateKey.buffer))

    expect(pkOneCache.buffer).toEqual(keyPairOne.privateKey.buffer)
    const signatureOne = schnorrkelOne.multiSigSign(keyPairOne.privateKey, msg, publicKeys, publicNonces)
    expect(pkOneCache.buffer).toEqual(keyPairOne.privateKey.buffer)

    const pkTwoCache = new Key(Buffer.from(keyPairTwo.privateKey.buffer))
    expect(pkTwoCache.buffer).toEqual(keyPairTwo.privateKey.buffer)
    const signatureTwo = schnorrkelTwo.multiSigSign(keyPairTwo.privateKey, msg, publicKeys, publicNonces)
    expect(pkTwoCache.buffer).toEqual(keyPairTwo.privateKey.buffer)

    const signatures = [signatureOne.signature, signatureTwo.signature]
    const signaturesSummed = Schnorrkel.sumSigs(signatures)
    const result = Schnorrkel.verify(signaturesSummed, msg, signatureTwo.finalPublicNonce, combinedPublicKey)

    expect(result).toEqual(true)
  })
  it("should verify a schnorr signature with a custom hash function", () => {
    const privateKey = new Key(Buffer.from(ethers.utils.randomBytes(32)))

    const abiCoder = new ethers.utils.AbiCoder()
    const msg = abiCoder.encode(["string"], ["test message"])
    const hashFn = ethers.utils.keccak256
    const signature = Schnorrkel.sign(privateKey, msg, hashFn)

    const publicKey = ethers.utils.arrayify(ethers.utils.computePublicKey(ethers.utils.computePublicKey(privateKey.buffer, false), true))

    expect(signature.finalPublicNonce.buffer).toHaveLength(33)
    expect(signature.signature.buffer).toHaveLength(32)
    expect(signature.challenge.buffer).toHaveLength(32)
    const result = Schnorrkel.verify(signature.signature, msg, signature.finalPublicNonce, new Key(Buffer.from(publicKey)), hashFn)
    expect(result).toEqual(true)
  })
  it("should sum the signatures and verify them using a custom hash function for the message", () => {
    const schnorrkelOne = new Schnorrkel()
    const schnorrkelTwo = new Schnorrkel()

    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()
    const publicNoncesOne = schnorrkelOne.generatePublicNonces(keyPairOne.privateKey)
    const publicNoncesTwo = schnorrkelTwo.generatePublicNonces(keyPairTwo.privateKey)

    const publicNonces = [publicNoncesOne, publicNoncesTwo]
    const publicKeys = [keyPairOne.publicKey, keyPairTwo.publicKey]

    const combinedPublicKey = Schnorrkel.getCombinedPublicKey(publicKeys)

    const abiCoder = new ethers.utils.AbiCoder()
    const msg = abiCoder.encode(["string"], ["test message"])
    const hashFn = ethers.utils.keccak256
    const signatureOne = schnorrkelOne.multiSigSign(keyPairOne.privateKey, msg, publicKeys, publicNonces, hashFn)
    const signatureTwo = schnorrkelTwo.multiSigSign(keyPairTwo.privateKey, msg, publicKeys, publicNonces, hashFn)

    const signatures = [signatureOne.signature, signatureTwo.signature]
    const signaturesSummed = Schnorrkel.sumSigs(signatures)
    const result = Schnorrkel.verify(signaturesSummed, msg, signatureTwo.finalPublicNonce, combinedPublicKey, hashFn)

    expect(result).toEqual(true)
  })
  it("should verify a signature hash", () => {
    const privateKey = new Key(Buffer.from(ethers.utils.randomBytes(32)))

    const msg = "test message"
    const hash = ethers.utils.solidityKeccak256(["string"], [msg])
    const signature = Schnorrkel.signHash(privateKey, hash)

    const publicKey = ethers.utils.arrayify(ethers.utils.computePublicKey(ethers.utils.computePublicKey(privateKey.buffer, false), true))

    expect(signature.finalPublicNonce.buffer).toHaveLength(33)
    expect(signature.signature.buffer).toHaveLength(32)
    expect(signature.challenge.buffer).toHaveLength(32)
    const result = Schnorrkel.verifyHash(signature.signature, hash, signature.finalPublicNonce, new Key(Buffer.from(publicKey)))
    expect(result).toEqual(true)
  })

  it("should verify a multi signature hash", () => {
    const schnorrkelOne = new Schnorrkel()
    const schnorrkelTwo = new Schnorrkel()

    const keyPairOne = generateRandomKeys()
    const keyPairTwo = generateRandomKeys()
    const publicNoncesOne = schnorrkelOne.generatePublicNonces(keyPairOne.privateKey)
    const publicNoncesTwo = schnorrkelTwo.generatePublicNonces(keyPairTwo.privateKey)

    const publicNonces = [publicNoncesOne, publicNoncesTwo]
    const publicKeys = [keyPairOne.publicKey, keyPairTwo.publicKey]

    const msg = "test message"
    const hash = ethers.utils.solidityKeccak256(["string"], [msg])
    const signature = schnorrkelOne.multiSigSignHash(keyPairOne.privateKey, hash, publicKeys, publicNonces)
    const signatureTwo = schnorrkelTwo.multiSigSignHash(keyPairTwo.privateKey, hash, publicKeys, publicNonces)
    const signatures = [signature.signature, signatureTwo.signature]
    const signaturesSummed = Schnorrkel.sumSigs(signatures)

    const combinedPublicKey = Schnorrkel.getCombinedPublicKey(publicKeys)
    const result = Schnorrkel.verifyHash(signaturesSummed, hash, signature.finalPublicNonce, combinedPublicKey)
    expect(result).toEqual(true)
  })
})
