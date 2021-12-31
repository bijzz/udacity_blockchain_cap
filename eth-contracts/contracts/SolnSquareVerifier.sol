pragma solidity >=0.4.21 <0.6.0;

import './Verifier.sol';
import './ERC721Mintable.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {

    // for solution verification
    Verifier private verifier;

    constructor(address caller,
                string memory name,
                string memory symbol) 
    public 
    CustomERC721Token(name, symbol)
    {
        verifier = Verifier(caller);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 Index; // aka tokenId
        address Address;
    }

    // TODO define an array of the above struct
    Solution[] solutions; 


    // TODO define a mapping to store unique solutions submitted
    // key is the encoded solution
    mapping(bytes32 => Solution) unqiueSolutions;

    // TODO Create an event to emit when a solution is added
    event AddedSolution(uint256 Index, address Address);


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input,
            uint256 Index) 
             public
             {

        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(unqiueSolutions[key].Address == address(0x0), "The solution has already been used");
        
        Solution memory solution = Solution({Index:Index, Address:msg.sender});
        // add solution to unqiue list
        unqiueSolutions[key] = solution;
        // keep track of sender
        solutions.push(solution);
        
        emit AddedSolution(Index, msg.sender);
    }


    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNewNFT (
            // arguments - compare to verifyTx function
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input,
            uint256 tokenId
    ) public
    {
        require(verifier.verifyTx(a, b, c, input), "Solution verification not successful");
        addSolution(a, b, c, input, tokenId);

        super._mint(msg.sender, tokenId);
    }


}




















