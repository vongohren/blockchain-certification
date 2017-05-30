pragma solidity ^0.4.11;

import './Project.sol';

contract FundingHub {
  address public owner;
  address[] public projectAddresses;

  event projectCreatedSuccessfully(address adr);
  event notFundable();
  event fundableStatus(bool status);

  modifier restricted() { if(msg.sender == owner) _; }

  function FundingHub() {
    owner = msg.sender;
  }

  function getBalance() constant returns (uint256 balance) {
      return this.balance;
  }

  function createProject(bytes32 _name, address _owner, uint _amountToBeRaised, uint unixDeadline)  {
      address newProject = new Project(_name, _owner, _amountToBeRaised, unixDeadline);
      projectAddresses.push(newProject);
      projectCreatedSuccessfully(newProject);
  }

  function contribute(address _address) payable {
      Project project = Project(_address);
      project.fund.gas(230000).value(msg.value)(msg.sender);
  }

  function getProjects() constant returns (address[]) {
      return projectAddresses;
  }

  function kill() restricted constant {
       selfdestruct(owner);
   }
}
