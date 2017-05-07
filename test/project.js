var Project = artifacts.require("./Project.sol");

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

contract('Project', function(accounts) {
    
  // it("should put 10000 MetaCoin in the first account", function() {
  //   return Project.deployed().then(function(instance) {
  //       wait(500);
  //       return instance.payout({from:accounts[0]});
  //   }).then(function(result) {
  //       for(var event of result.logs) {
  //           console.log(event.args)
  //       }
  //       assert.equal(true, true, "life is true");
  //   });
  // });
});
