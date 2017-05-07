pragma solidity ^0.4.8;

contract Project {
  address owner;
  uint public amountToBeRaised;
  uint public unixDeadline;
  uint public raisedAmount;

  mapping (address => uint) public contributors;
  event broadCastAddress(uint thing);


  modifier restricted() {
    if (msg.sender == owner) _;
    else broadCastAddress(2);
  }

  modifier onlyAfter(uint _time) { if(now > _time) _;}
  modifier onlyIfFunded() { if(raisedAmount >= amountToBeRaised) _; else broadCastAddress(4);}
  modifier onlyIfHaveMoney() { if(contributors[msg.sender] > 0) _; }

  function Project(address _owner, uint _amountToBeRaised, uint _unixDeadline) {
    owner = _owner;
    amountToBeRaised = _amountToBeRaised;
    unixDeadline = _unixDeadline;
    raisedAmount = 0;
  }

  function fund(uint amount) payable {
      raisedAmount += amount;
      contributors[msg.sender] = amount;
  }

  function payout() restricted onlyAfter(unixDeadline) onlyIfFunded {
      if(!owner.send(raisedAmount)) throw;
  }
  function payout(address _address) restricted onlyAfter(unixDeadline) onlyIfFunded {
      if(!_address.send(raisedAmount)) throw;
  }


  function refund() onlyAfter(unixDeadline) onlyIfFunded onlyIfHaveMoney {
      uint amount = contributors[msg.sender];
      contributors[msg.sender] = 0;
      if(!msg.sender.send(amount)) {
          throw;
      }
  }

}
