var Project = artifacts.require("./Project.sol");
var FundingHub = artifacts.require("./FundingHub.sol");

module.exports = function(deployer, network, accounts) {
    console.log(network)
    if(network === 'development') {
        deployer.deploy(Project, accounts[0], 0, (+new Date)/1000);
        deployer.link(Project, FundingHub);
    }
    deployer.deploy(FundingHub);
};
