//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "./CustomERC721Token.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token, SquareVerifier {
    SquareVerifier public _squareVerifier;

    constructor(address verifierAddress) {
        _squareVerifier = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 _index;
        address _address;
    }

    // TODO define an array of the above struct
    Solution[] solutionArray;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions;

    // TODO Create an event to emit when a solution is added
    event AddSolution(uint256 index, address to);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolutions(
        uint256 _index,
        address _to // bytes32 _key
    ) public {
        Solution memory solution = Solution(_index, _to);
        solutionArray.push(solution);
        // solutions[_key] = solution;

        emit AddSolution(_index, _to);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    function mintNewNFT(
        uint256 Id,
        Proof memory proof,
        uint256[1] memory inputs
    ) public returns (bool) {
        //  - make sure the solution is unique (has not been used before)
        require(
            _squareVerifier.verifyTx(proof, inputs),
            "FALSE: Create a function to mint new NFT only after the solution has been verified"
        );
        //  - make sure you handle metadata as well as tokenSuplly
        // bytes32 key = generateKey(proof.a, proof.b, proof.c, inputs);
        addSolutions(Id, msg.sender);
        return mint(msg.sender, Id);
    }
}
