const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");

contract('TestSolnSquareVerifier', accounts => {

// - use the contents from proof.json generated from zokrates steps
const proof = require("./proof");
const tagProof = proof.proof;
const tagInputsValid = proof.inputs;
const inputsInvalid = [9, 9];
    
describe('test solution square verifier', function () {
    beforeEach(async function () { 
        // setup 
        this.verifier = await Verifier.new({from:accounts[0]});
        this.contract = await SolnSquareVerifier.new(this.verifier.address, "HousingToken", "HSNTKN");
    })


// Test if a new solution can be added for contract - SolnSquareVerifier
it('test new solution can be added', async function () { 
    let tokenId = 1
    let revert = false;
    try {
        let compute = await this.contract.addSolution.call(tagProof.a, tagProof.b, tagProof.c, tagInputsValid, tokenId, {from:accounts[0]});
    } catch(e) {
        revert = true;
        console.log(e);
    }
    assert.equal(revert, false, "Solution was not added succesfully.");
})

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
it('test ERC721 token can be minted', async function () { 
    let tokenId = 1
    let revert = false;
    try {
        let compute = await this.contract.mintNewNFT.call(tagProof.a, tagProof.b, tagProof.c, tagInputsValid, tokenId, {from:accounts[0]});
    } catch(e) {
        revert = true;
        console.log(e);
    }
    assert.equal(revert, false, "Token minting failed");
})


});


})
