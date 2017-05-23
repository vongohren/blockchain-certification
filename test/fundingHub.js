var FundingHub = artifacts.require("./FundingHub.sol");
var Project = artifacts.require("./Project.sol");

contract('FundingHub', function(accounts) {
    //
    // it("FundingHub test", function() {
    //     var fundingInst;
    //     return FundingHub.deployed().then(function(instance) {
    //         fundingInst = instance
    //         return instance.createProject("doesthiswork", accounts[0], 2, (+new Date)/1000)
    //     }).then(function(result) {
    //         return fundingInst.projectsByName.call('doesthiswork')
    //     }).then(function(projectAddress) {
    //         console.log(projectAddress)
    //         return fundingInst.projectAddresses.call(1)
    //     }).then(function(projects) {
    //         console.log(projects)
    //         return Project.at(projects);
    //     }).then(function(instance) {
    //         return instance.amountToBeRaised.call()
    //     }).then(function(amount) {
    //         console.log(amount)
    //     })
    // });
    //
    // it("FundingHub iterate test", function() {
    //     var fundingInst;
    //     return FundingHub.deployed().then(function(instance) {
    //         fundingInst = instance
    //         return instance.createProject("doesthiswork", accounts[0], 2, (+new Date)/1000)
    //     }).then(function(result) {
    //         return fundingInst.logAllProjects()
    //     }).then(function(result) {
    //         console.log("RESULT 1")
    //         console.log(result)
    //         console.log(result.logs[0].args)
    //         console.log(web3.toAscii(result.logs[0].args.name))
    //         console.log(result.logs[1].args)
    //         console.log(web3.toAscii(result.logs[1].args.name))
    //     })
    // });

    // it("FundingHub iterate test", function() {
    //     var fundingInst;
    //     var projects;
    //     return FundingHub.deployed().then(function(instance) {
    //         fundingInst = instance
    //         return instance.createProject("doesthiswork", accounts[0], 3, (+new Date)/1000)
    //     }).then(function(result) {
    //         return fundingInst.getProjects.call()
    //     }).then(function(result) {
    //         projects = result
    //         var project = Project.at(projects[0])
    //
    //         return project.amountToBeRaised.call()
    //     }).then(function(amount) {
    //         var project = Project.at(projects[1])
    //         return project.amountToBeRaised.call()
    //     }).then(function(amount) {
    //     })
    // });
});
