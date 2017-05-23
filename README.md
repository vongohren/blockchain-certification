# Final exams project

This is the repo for vongohren's final exams project
For debugging delivery, please read DEBUGGING_EXERCISE.md

# Exam notes

### Refund method
I have chosen to go with the withdraw pattern, cause a gigantic loop, with a timer based setup is just to much complexity to evne care for. Then one can rather create some kind of emailing, notficiations system around the fund, so that you are kindly reminded to go refund your contract.

### Payout/payoutTo
Iv added a payout / payoutTo method to be able to payout to a different address than the owner address.

### State Machine
A known pattern is the state machine, and this could be a well used pattern here for the contract will be in mulitple different states. Iv decided just to take a note on it rather then implement because of lack of time. But a nice reference to it can be found here: http://solidity.readthedocs.io/en/develop/common-patterns.html#state-machine

### Registry
I never completed the registry task completly so I decided not to pursue that in this final exams. But registry would be a perfect solution for this fundingHub contract, so it would be a nice way to handle the different projects. Instead of storing everything in storage as name and such. But that would be for a next time!

### Fund amount
Iv decided to send 1 ethere on every fund, just because I didnt want to implement an input button, because the lack of time. But it would be simple HTML js fix.

### JS framework
I would have used some other frameworks if the time allowed me to. I'm quite used to using react and redux, and it would be fun to adapt it into that eco system. Based on how the web app builds now, it should not be a problem at all, just work and time, which I did not have.
