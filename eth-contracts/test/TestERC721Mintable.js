var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {
    const account_owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("HousingToken", "HSNTKN", {from: account_owner});

            // TODO: mint multiple tokens
            // TokenId 1,2..
            await this.contract.mint(account_one, 1, {from: account_owner});
            await this.contract.mint(account_two, 2, {from: account_owner});
        })

        it('should return total supply', async function () { 
            assert.equal(await this.contract.totalSupply(), 2, "Mismatch of total expected supply");
        })

        it('should get token balance', async function () { 
            assert.equal(await this.contract.balanceOf(account_one), 1, "Balance is not correct");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            assert.equal(await this.contract.tokenURI(1), 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1', "Token uri is not complete");
        })

        it('should transfer token from one owner to another', async function () { 
            
            try {
              // exchange token 1 from account_one to account_two
              await this.contract.transferFrom(account_one, account_two, 1, {from: account_one});
            } catch (e) {
              console.log(e);
            }
            assert.equal(await this.contract.ownerOf(1), account_two, "Token was not succesfully transferred");

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("HousingToken", "HSNTKN", {from: account_owner});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let reverted = false;
            try 
            {
                // should fail as account_two is not contract owner
                await this.contract.mint(account_one, 3, {from: account_two});
            }
            catch(e) {
                reverted = true;
            }
            assert.equal(reverted, true, "Even non contract owner's are able to mint.");
        })

        it('should return contract owner', async function () { 
            let ownerAddress = await this.contract.getOwner();
            assert.equal(ownerAddress, account_owner, "Contract owner is not correct");

        })

    });
})