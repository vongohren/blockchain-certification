var Project = artifacts.require("./Project.sol");

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

contract('Project', function(accounts) {
    var project;
    var succssfullEvent
    it("should be 0 amount raised after a succssfull payout", function() {
        return Project.deployed().then(function(instance) {
            project = instance;
            return project.fund(web3.toWei(1), {from:accounts[0]});
        }).then(function(result) {
            wait(500);
            return project.payout({from:accounts[0], gas:300000});
        }).then(function(result) {
            succssfullEvent = result.logs[0].event
            return project.raisedAmount.call()
        }).then(function(result) {
            assert.equal(succssfullEvent, 'payoutSuccessful', 'Did not get payoutSuccessful event')
            assert.equal(result.toNumber(), 0, 'Raised amount has not been reset');
        })
    })
});
