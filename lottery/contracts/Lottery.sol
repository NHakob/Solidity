pragma solidity ^0.4.17;

contract Lottery {
    address private manager;
    address[] private players;
    
    function Lottery() public {
        manager = msg.sender;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function enter() public payable {
        require(msg.value == 1000 wei && msg.sender != manager);

        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        // Generate random number based on passed parameters
        return uint(sha3(block.difficulty, now, players)); //keccak256 same sha3
    }

    function pickWinner() public restricted {
        // Will choose winner and transfer 99% of balance to winner
        players[random() % players.length].transfer(this.balance * 99 / 100);
        // Reset players list
        players = new address[](0);
    }

    // Put code instead of "_" symbol
    modifier restricted() {
        // Give permission to pick winner only to manager
        require(msg.sender == manager);
        _;
    }
}