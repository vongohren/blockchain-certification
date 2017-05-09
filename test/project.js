var Project = artifacts.require("./Project.sol");
var moment = require('moment');

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function calculateGas(web3, result) {
    var gasPrice = web3.eth.getTransaction(result.receipt.transactionHash).gasPrice;
    var gasUsage = web3.toBigNumber(result.receipt.cumulativeGasUsed);
    return gasUsage.times(gasPrice);
}

contract('Project', function(accounts) {

    it("Contributors should be able to refund after deadline on a unfunded project", function(done) {
        var projectInstance;
        var owner = accounts[0];
        var refundEvents = [];
        var fundingEvents = [];
        var donatorOne = accounts[3];
        var donatorTwo = accounts[4];
        var amountToBeRaised = web3.toWei(3);
        var fundedDate = Math.floor(moment().add(1,'s').format('x')/1000);
        var donatorOneBalanceBefore = web3.eth.getBalance(donatorOne);
        var donatorTwoBalanceBefore = web3.eth.getBalance(donatorTwo);
        var donatorOneGasUsed;
        var donatorTwoGasUsed;
        Project.new(owner, amountToBeRaised, fundedDate ).then(function(projectIns) {
            projectInstance = projectIns;
            return projectInstance.fund({from:donatorOne, value:web3.toWei(1)})
        }).then(function(result){
            result.logs[0].event === 'fundingSuccessful' ? fundingEvents.push(result.logs[0]) : console.log(result.logs[0].event)
            donatorOneGasUsed = calculateGas(web3, result);
            return projectInstance.fund({from:donatorTwo, value:web3.toWei(1)})
        }).then(function(result){
            result.logs[0].event === 'fundingSuccessful' ? fundingEvents.push(result.logs[0]) : console.log(result.logs[0].event)
            donatorTwoGasUsed = calculateGas(web3, result);
            wait(1000)
            return projectInstance.refund({from:donatorOne})
        }).then(function(result){
            donatorOneGasUsed = donatorOneGasUsed.add(calculateGas(web3, result));
            result.logs[0].event === 'refundSuccessful' ? refundEvents.push(result.logs[0]) : console.log(result.logs[0].event)
            return projectInstance.refund({from:donatorTwo})
        }).then(function(result){
            donatorTwoGasUsed = donatorTwoGasUsed.add(calculateGas(web3, result));
            result.logs[0].event === 'refundSuccessful' ? refundEvents.push(result.logs[0]) : console.log(result.logs[0].event)
            return projectInstance.raisedAmount.call()
        }).then(function(amount) {
            var donatorOneBalanceAfter = web3.eth.getBalance(donatorOne)
            var donatorTwoBalanceAfter = web3.eth.getBalance(donatorTwo)

            assert.equal(refundEvents.length, 2, 'Length of refunded events was not 2!')
            assert.equal(fundingEvents.length, 2, 'Length of funding events was not 2!')
            assert.equal(amount.toNumber(), 0, 'Raised amount is not refunded properly')
            assert.equal(donatorOneBalanceAfter.add(donatorOneGasUsed).minus(donatorOneBalanceBefore), 0, 'Something went wrong with the refund, amount of account one is unbalanced')
            assert.equal(donatorTwoBalanceAfter.add(donatorTwoGasUsed).minus(donatorTwoBalanceBefore), 0, 'Something went wrong with the refund, amount of account two is unbalanced')
            done()
        }).catch(done);
    })

    it("Account 2 should have one more ether, and a raisedAmount should be 0, after a succssfull payout.", function(done) {
        var project;
        var succssfullEvent;
        var balanceBefore;
        var balanceAfter;
        var beforeFundingBalance;
        var afterFundingBalance;
        var gasUsage;
        var gasPrice;
        Project.new(accounts[0], 1, (+new Date)/1000).then(function(projectIns) {
            balanceBefore = web3.eth.getBalance(accounts[2]);
            beforeFundingBalance = web3.eth.getBalance(accounts[1]);
            project = projectIns;
            var value = web3.toWei(1);
            return project.fund({from:accounts[1], value: value, gas:200000});
        }).then(function(result) {
            gasPrice = web3.eth.getTransaction(result.receipt.transactionHash).gasPrice;
            gasUsage = web3.toBigNumber(result.receipt.cumulativeGasUsed).times(gasPrice);
            //is needed so that the time of the contract project is out
            wait(500);
            return project.payoutTo(accounts[2], {from:accounts[0], gas:200000});
        }).then(function(result) {
            succssfullEvent = result.logs[0].event
            return project.raisedAmount.call()
        }).then(function(result) {
            balanceAfter = web3.eth.getBalance(accounts[2]);
            afterFundingBalance = web3.eth.getBalance(accounts[1]);
            assert.equal(beforeFundingBalance.minus(gasUsage).minus(afterFundingBalance), web3.toWei(1), 'The funding account funded to much')
            assert.equal(balanceAfter.minus(balanceBefore), web3.toWei(1), 'The payout account didnt recieve its proper funds');
            assert.equal(succssfullEvent, 'payoutSuccessful', 'Did not get payoutSuccessful event')
            assert.equal(result.toNumber(), 0, 'Raised amount has not been reset');
            done()
        })
    })


});
