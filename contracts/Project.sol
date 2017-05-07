pragma solidity ^0.4.8;

contract Project {
  address owner;
  uint public amountToBeRaised;
  uint public unixDeadline;
  uint public raisedAmount;

  mapping (address => uint) public contributors;
  event broadCastAddress(uint thing);
  event payoutSuccessful();


  modifier restricted() {
    if (msg.sender == owner) _;
  }

  modifier onlyAfter(uint _time) { if(now > _time) _;}
  modifier onlyIfFunded() { if(raisedAmount >= amountToBeRaised) _; }
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
      sendSafe(owner);
  }
  function payoutTo(address _address) restricted onlyAfter(unixDeadline) onlyIfFunded {
      sendSafe(_address);
  }

  function sendSafe(address _address) private {
      uint amount = raisedAmount;
      raisedAmount = 0;
      if(!_address.send(raisedAmount)) {
          raisedAmount = amount;
          throw;
      }
      payoutSuccessful();
  }

  function refund() onlyAfter(unixDeadline) onlyIfFunded onlyIfHaveMoney {
      uint amount = contributors[msg.sender];
      contributors[msg.sender] = 0;
      if(!msg.sender.send(amount)) {
          throw;
      }
  }

}
