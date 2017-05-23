# Final exams project

This is the repo for vongohren's final exams project
For debugging delivery, please read DEBUGGING_EXERCISE.md

# Notes

### Refund method
I have chosen to go with the withdraw pattern, cause a gigantic loop, with a timer based setup is just to much complexity to evne care for. Then one can rather create some kind of emailing, notficiations system around the fund, so that you are kindly reminded to go refund your contract.

### Payout/payoutTo
Iv added a payout / payoutTo method to be able to payout to a different address than the owner address.


### State Machine
A known pattern is the state machine, and this could be a well used pattern here for the contract will be in mulitple different states. Iv decided just to take a note on it rather then implement because of lack of time. But a nice reference to it can be found here: http://solidity.readthedocs.io/en/develop/common-patterns.html#state-machine
