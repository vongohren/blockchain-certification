pragma solidity ^0.4.11;

contract Project {
  address owner;
  uint public amountToBeRaised;
  uint public fundedDate;
  uint public raisedAmount;
  bytes32 public name;
  mapping (address => uint) public contributors;
  address[] public contributorsArray;

  event payoutSuccessful(uint amount);
  event fundingSuccessful();
  event refundSuccessful();

  modifier restricted() { require(msg.sender == owner); _; }

  modifier onlyAfterFundedDate() { require(now >= fundedDate); _;}
  modifier onlyBeforeFundedDate() { if(now < fundedDate) _;}
  modifier onlyIfFunded() { require(raisedAmount >= amountToBeRaised); _; }
  modifier onlyIfNotFunded() { if(raisedAmount < amountToBeRaised) _; }
  modifier onlyIfHaveMoney() { require(contributors[msg.sender] > 0); _; }

  function Project(bytes32 _name, address _owner, uint _amountToBeRaised, uint _fundedDate) {
    owner = _owner;
    name = _name;
    amountToBeRaised = _amountToBeRaised;
    fundedDate = _fundedDate;
    raisedAmount = 0;
  }

  function getName() returns(bytes32) {
      return name;
  }

  function fund() payable onlyIfNotFunded {
      raisedAmount += msg.value;
      contributors[msg.sender] = msg.value;
      contributorsArray.push(msg.sender);
      fundingSuccessful();
  }

  function payout() restricted onlyAfterFundedDate onlyIfFunded {
      sendSafe(owner);
  }
  function payoutTo(address _address) restricted onlyAfterFundedDate onlyIfFunded {
      sendSafe(_address);
  }

  function sendSafe(address _address) private {
      uint amount = raisedAmount;
      raisedAmount = 0;
      _address.transfer(amount);
      payoutSuccessful(amount);
  }

  function refund() onlyAfterFundedDate onlyIfNotFunded onlyIfHaveMoney {
      uint amount = contributors[msg.sender];
      contributors[msg.sender] = 0;
      raisedAmount -= amount;
      msg.sender.transfer(amount);
      refundSuccessful();
  }

}
