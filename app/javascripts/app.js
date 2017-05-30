import "../stylesheets/app.css";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import fundinghub_artifacts from '../../build/contracts/FundingHub.json'
import project_artifacts from '../../build/contracts/Project.json'
import $ from 'jquery'
import mustache from 'mustache'
import projectTemplate from '../templates/projects'
import accountTemplate from '../templates/account-selector'
import moment from 'moment'

var FundingHub = contract(fundinghub_artifacts);
var Project = contract(project_artifacts);


var fundingHubInstance;
var accounts;
var account;

window.App = {
    start: function() {
        var self = this;
        $('#projects').on('click',function(e) {
            var address = $(e.target).data('address')
            if(address) {
                self.fundProject(address);
            }
        })
        $('#accounts').on('change',function(e) {
            account = $(e.target).val();
        })

        $('#create-form').submit(function(e) {
            e.preventDefault();
            var $inputs = $('#create-form :input')
            var values = {};
            $inputs.each(function() {
                if(this.name) values[this.name] = $(this).val();
            });
            values.amount = web3.toWei(values.amount);
            values.date = moment(values.date).format('x')/1000
            self.createProject(values);
        })
        FundingHub.setProvider(web3.currentProvider);
        Project.setProvider(web3.currentProvider);
        FundingHub.deployed().then(function(instance) {
            fundingHubInstance = instance;
            self.getProjects();
        }).catch(function(e) {
            console.log(e)
            $('body').html('FundingHub contract is not found on this blockchain instance. Please deploy it and refresh the web app, or maybe your chain instance is not running?')
        })

        this.getAvailableAccounts();
    },

    getProjects() {
        var self = this;
        fundingHubInstance.getProjects.call().then(function(projects) {
            self.showProjects(projects)
        })
    },

    getAvailableAccounts() {
        var self = this;
        web3.eth.getAccounts(function(err, accs) {
          if (err != null) {
            console.log("There was an error fetching your accounts.");
            return;
          }

          if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
          }

          accounts = accs;
          if(!account) {
            account = accounts[0];
          }

          self.loadAccountsHtml(accounts);
        });
    },

    loadAccountsHtml(accounts) {
        var data = {};
        data.accounts = []
        for(var acc of accounts) {
            var obj = {}
            if(acc === account) {
                obj.selected = true;
            }
            obj.balance= web3.fromWei(web3.eth.getBalance(acc))
            obj.address = acc;
            data.accounts.push(obj)
        }

        var accountDom = $("#accounts");
        var html = mustache.render(accountTemplate, data)
        accountDom.html(html)
    },

    createProject(values) {
        var self = this;
        fundingHubInstance.createProject(values.name, account, values.amount, values.date, {from:account, gas:650000}).then(function(result) {
            console.log(result);
            self.getProjects()
        })
    },

    fundProject(address) {
        var self = this;
        fundingHubInstance.contribute(address, {from:account, gas:270000, value:web3.toWei(1)})
        .then(function(result) {
            console.log(result)
            self.fetchData(address)
            self.getAvailableAccounts()
        })
    },

    fetchData: function(project) {
        var self = this;
        var address = project
        var name;
        var amountToBeRaised;
        var raisedAmount;
        var instance;
        var fundedDate;
        var contributors;
        Project.at(project).then(function(_instance) {
            instance=_instance;
            _instance.payoutIsAvailable({}).watch(function(error, result) {
                if(error) {
                    console.log(error)
                } else {
                    console.log(result)
                }
            })
            _instance.refundIsAvailable({}).watch(function(error, result) {
                if(error) {
                    console.log(error)
                } else {
                    console.log(result)
                }
            })
            return instance.name.call()
        }).then(function(_name,var1) {
            name = _name
            return instance.amountToBeRaised.call()
        }).then(function(_amountToBeRaised) {
            amountToBeRaised = _amountToBeRaised
            return instance.raisedAmount.call()
        }).then(function(_raisedAmount) {
            raisedAmount = _raisedAmount
            return instance.fundedDate.call()
        }).then(function(_fundedDate) {
            fundedDate = _fundedDate;
            return instance.getContributors.call()
        }).then(function(_contributors) {
            contributors = _contributors;
            var projectData = {}
            projectData.name = web3.toAscii(name)
            projectData.amountToBeRaised = web3.fromWei(amountToBeRaised);
            projectData.address = address;
            projectData.raisedAmount = web3.fromWei(raisedAmount);
            projectData.fundedDate = moment(fundedDate*1000).format('DD MMMM YYYY')
            projectData.contributors = contributors
            self.renderHtml(projectData)
        })
    },

    showProjects: function(projects) {
        var self = this;
        for(var project of projects) {
            self.fetchData(project);
        }
    },

    renderHtml: function(projectData) {
        var projectsDom = $("#projects");
        var html = mustache.render(projectTemplate, projectData)
        var dom = $('#'+projectData.address)
        if(dom.length) {
            dom.html(html)
        } else {
            projectsDom.append(html)
        }

    }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
