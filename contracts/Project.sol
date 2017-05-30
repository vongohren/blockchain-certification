pragma solidity ^0.4.11;

contract Project {
  address owner;
  uint public amountToBeRaised;
  uint public fundedDate;
  uint public raisedAmount;
  bytes32 public name;
  mapping (address => uint) public contributors;
  address[] public contributorsArray;

  enum Stages {
      Fundable,
      Payout,
      Refund
  }

  Stages public currentStage = Stages.Fundable;

  event payoutSuccessful(uint amount);
  event fundingSuccessful(address adr);
  event refundSuccessful();
  event refundIsAvailable();
  event payoutIsAvailable();

  modifier restricted() { require(msg.sender == owner); _; }

  function nextStage(Stages newStage) internal {
    currentStage = Stages(uint(newStage));
  }

  modifier atStage(Stages _stage) {
    require(currentStage == _stage);
    _;
  }

  modifier statefullTransition(uint amount) {
    if (currentStage == Stages.Fundable && now >= fundedDate+1 seconds) {
        if((raisedAmount+amount) < amountToBeRaised) {
            nextStage(Stages.Refund);
            refundIsAvailable();
        } else {
            nextStage(Stages.Payout);
            payoutIsAvailable();
        }
    }
    if (currentStage == Stages.Fundable && (raisedAmount+amount) > amountToBeRaised) {
        nextStage(Stages.Payout);
        payoutIsAvailable();
    }
    _;
  }

  function Project(bytes32 _name, address _owner, uint _amountToBeRaised, uint _fundedDate) {
    owner = _owner;
    name = _name;
    amountToBeRaised = _amountToBeRaised;
    fundedDate = _fundedDate;
    raisedAmount = 0;
  }

  function getContributors() constant returns (address[]) {
      return contributorsArray;
  }

  function fund(address _sender) payable atStage(Stages.Fundable) statefullTransition(msg.value) {
      var amount = msg.value;
      raisedAmount += amount;
      if(contributors[_sender] == 0) {
          contributorsArray.push(_sender);
      }
      contributors[_sender] += amount;
      fundingSuccessful(_sender);
  }

  function payout() restricted atStage(Stages.Payout) {
      sendSafe(owner);
  }
  function payoutTo(address _address) restricted atStage(Stages.Payout) {
      sendSafe(_address);
  }

  function sendSafe(address _address) private {
      uint amount = raisedAmount;
      raisedAmount = 0;
      _address.transfer(amount);
      payoutSuccessful(amount);
  }

  function refund() atStage(Stages.Refund) {
      uint amount = contributors[msg.sender];
      contributors[msg.sender] = 0;
      raisedAmount -= amount;
      msg.sender.transfer(amount);
      refundSuccessful();
  }

}
