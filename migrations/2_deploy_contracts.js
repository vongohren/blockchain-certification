var Project = artifacts.require("./Project.sol");
var FundingHub = artifacts.require("./FundingHub.sol");
var moment = require('moment')

module.exports = function(deployer, network, accounts) {
    if(network === 'development') {
        deployer.deploy(Project, accounts[0], 0, (+new Date)/1000);
        deployer.link(Project, FundingHub);
    }
    deployer.deploy(FundingHub);

    var fund, proj;
    if(network === 'development') {
        deployer.then(function() {
            return FundingHub.deployed();
        }).then(function(instance){
            fund = instance;
            return fund.createProject("New house", accounts[0], web3.toWei(100), moment().add(10,'day').format('x')/1000)
        }).then(function(result) {
            return fund.createProject("Sick dog", accounts[0], web3.toWei(4.5), moment().add(20,'day').format('x')/1000)
        })
    }
};
