var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];

    describe('Match ERC721 Spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, {from : account_one});
            await this.contract.mint(account_two, 2, {from : account_one});
            await this.contract.mint(account_three, 3, {from : account_one});
            await this.contract.mint(account_two, 4, {from : account_one});
           
        })

        it('should return total supply', async function () { 
            
            let totalTokens = await this.contract.totalSupply.call()
            assert.equal(totalTokens.toNumber(), 4, 'Failed to get correct 4 total tokens');

        })

        it('should get token balance', async function () { 

            //get the token balance for user 2 should be 2
            let tokenBalance = await this.contract.balanceOf.call(account_two)
            assert.equal(tokenBalance.toNumber(), 2, 'Failed to get correct token balance');

        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            
            //get the token URI
            let tokenURI = await this.contract.BaseTokenURI.call()
            assert.equal(tokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/', 'Failed to get correct token URI');            
            
        })

        it('should transfer token from one owner to another', async function () { 

            //transfer a token from acct one to acct two
            await this.contract.transferFrom(account_one, account_two, 1, {from : account_one});
            //get the balance of the acct two
            let tokenBalance = await this.contract.balanceOf.call(account_two)
            //it should be 3
            assert.equal(tokenBalance.toNumber(), 3, 'Failed to transfer token'); 
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 

            let notAllowed = false;
            try {
                //try to mint using a non-acct owner
                await this.contract.mint(account_two, 5, {from : account_two});
            } catch (error) {
                //should catch the error
                notAllowed = true;
            }
            assert.equal(notAllowed, true, 'Should fail when trying to mint token when not contract owner');
            
        })

        it('should return contract owner', async function () { 

            let acctOwner = await this.contract.Owner.call()
            assert.equal(acctOwner, account_one, 'Should return the acct owner id');
        })

    });
})