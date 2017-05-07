pragma solidity ^0.4.8;

import './Project.sol';

contract FundingHub {
  address public owner;
  mapping (bytes32 => address) public projects;


  modifier restricted() { if(msg.sender == owner) _; }

  function FundingHub() {
    owner = msg.sender;
  }

  function createProject(bytes32 _name, address _owner, uint _amountToBeRaised, uint unixDeadline)  {
      address newProject = new Project(_owner, _amountToBeRaised, unixDeadline);
      projects[_name] = newProject;
  }

  function contribute(address _address, uint amount) payable {
      Project project = Project(_address);
      project.fund(amount);
  }

  function kill() restricted {
       selfdestruct(owner);
   }
}
