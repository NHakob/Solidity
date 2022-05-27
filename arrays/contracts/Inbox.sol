pragma solidity ^0.4.17;

contract Inbox {
    uint[] public arr;


    function Inbox() public {
        arr.push(1);
        arr.push(10);
        arr.push(30);
    }

    function getLength() public view returns (uint) {
        return arr.length;
    }

    function getFirstElement() public view returns (uint) {
        return arr[0];
    }

    function getArray() public view returns (uint[]) {
        return arr;
    }
}