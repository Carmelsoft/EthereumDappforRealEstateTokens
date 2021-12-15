var Verifier = artifacts.require('Verifier');
var SolnSquareVerifierComplete = artifacts.require('SolnSquareVerifier');
let proof = require('../../zokrates/code/square/proof.json');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];

    describe('Solution Square Verifier - ZK Snarks', function () {
        beforeEach(async function () { 

            const zVerifier = await Verifier.new({ from: account_one })
            this.contract = await SolnSquareVerifierComplete.new(zVerifier.address, {from: account_one});
           
        })

        //Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can be added for contract', async function () { 
            
            let message = await this.contract.Mint(account_three, 1, 
                proof.proof.a,
                proof.proof.b,
                proof.proof.c,
                proof.inputs,
                { from: account_one}
            )

            assert.equal(message.logs[0].event, 'SolutionAdded', 'Did not add solution');

        })

        //Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract', async function () { 
            
            let successful = true;

            try
            {
            let message = await this.contract.Mint(account_three, 1, 
                proof.proof.a,
                proof.proof.b,
                proof.proof.c,
                proof.inputs,
                { from: account_one}
            )
            } catch(e)
            {
                successful = false;
            }

            assert.equal(successful, true, 'Did not mint new token');

        })

    });

})
