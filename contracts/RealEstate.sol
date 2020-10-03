// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract RealEstate {
  address public owner;

  constructor () public {
        owner = msg.sender;
    }

  struct Person {
        uint id;
        string name;
        string latitude;
        string longitude;
        bool forsale;
        uint price;
        address payable landOwner;
    }
    mapping(uint => Person) public persons;

    uint public personsCount;

    uint public sellers;

    mapping(address => uint) public personmapped;

    function addPerson (string memory _name,string memory _latitude,string memory _longitude,bool _forsale,uint _price) public {
        require(msg.sender == owner,"You are not the owner of contract");
        personsCount ++;
        persons[personsCount] = Person(personsCount,  _name, _latitude, _longitude, _forsale, _price,msg.sender);
        personmapped[msg.sender] = personsCount;
        if(_forsale){
            sellers++;
        }
    }

    function buyLand (uint _id, string memory _name,string memory _latitude,string memory _longitude,bool _forsale,uint _price) payable public {
        require(persons[_id].forsale == true,"Not for sale");
        require( msg.value >= 5 wei,"Not enough money provided");
        persons[_id].landOwner.transfer(msg.value);
        persons[_id] = Person(_id,  _name, _latitude, _longitude, _forsale, _price, msg.sender);
        personmapped[msg.sender] = personsCount;
        if(!_forsale){
            sellers--;
        }
    }
}
