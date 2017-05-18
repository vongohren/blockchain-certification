var Project = artifacts.require("./Project.sol");
var FundingHub = artifacts.require("./FundingHub.sol");

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
            return fund.createProject("test", accounts[0], web3.toWei(100), (+new Date)/1000)
        }).then(function(result) {
            console.log(result.logs[0].args)
            return fund.createProject("test2", accounts[0], web3.toWei(50), (+new Date)/1000)
        })
    }
};
