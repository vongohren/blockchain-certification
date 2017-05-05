# Contract one
```
pragma solidity ^0.4.5;

contract PiggyBank {
    address owner;
    uint248 balance;

    function piggyBank() {
        owner = msg.sender;
        balance += uint248(msg.value);
    }

    function () payable {
        if (msg.sender != owner) throw;
        balance += uint248(msg.value);
    }

    function kill() {
        if (msg.sender != owner) throw;
        selfdestruct(owner);
    }
}
```
1. Constructor name is not proper, need a big P to be recognized as a contructor. Now everybody can become the owner of this contract and the balance would increase.
2. Msg value used in a non payable function is another thing
3. Casting to a lower bitsize than default is not nessecary, and it might even cost more gas based on unpacking. So keep the default uint256/uint
4. I would rather use a constructor parameter than basing on the message value.
5. It’s more gas expensive to throw than to do nothing, so I would rather have in the kill function: “if is owner”, then selfdestruct. Then we dont consume so much gas.
6. It is good practise to throw when you have functions that recieve ether, because it’s the easiest way to make sure the person sending the ether will get it back if something goes wrong. This is based on gas consumption, that sending things back to the sender, also consumes gas.
7. Make balance public so you can check how much you have in your piggybank
8. There is no way for the owner to retrieve a selected amount from the piggybank. Atleas I had a small lock in the bottom when I was a kid. To be able to take out some money.
9. A piggybank is bad investment, I would rather tell them to put it in a fund :P
10. Consider avoid using fallback function because of its stipend 2300 gas consumption when it comes from a contract call. (Wait for feedback from the b9lab boyz.)

# Contract two
```
pragma solidity ^0.4.5;

contract WarehouseI {
    function ship(uint id, address customer) returns (bool handled);
}

contract Store {
    address wallet;
    WarehouseI warehouse;

    function Store(address _wallet, address _warehouse) {
        wallet = _wallet;
        warehouse = WarehouseI(_warehouse);
    }

    function purchase(uint id) returns (bool success) {
        wallet.send(msg.value);
        return warehouse.ship(id, msg.sender);
    }
}
```
1. Send might not fulfill and based on everything that can go wrong with send, its atleast important to have a if check around send to see if it went ok. Send returns true and false. If not OK, throw.
2. Consider to rather create a withdraw function, so that the store wallet can pull out money from the store, rather than sending all the money. Its a safer pattern.
3. If a withdraw function is implemented, we could add some events to have the contracts or web3 apps using this contract, listen to the event, and withdraw every time its called.
4. We are missing an implementation of our warehouse interface, which is quite cruical for this strategy to work. Unless it is suppose to be hidden.
5. Based on what the ship function, there could be a whole stuff going on there that we downt know of, but it seems safe, since we only send in an int and the address we want to ship it to. One problem though, we might not know who or where to send the item to based on only the adress from the sender. Unless its digital and can be handled by a wallet, its a problem.

# Contract three
```
pragma solidity ^0.4.4;

contract Splitter {
    address one;
    address two;

    function Splitter(address _two) {
        if (msg.value > 0) throw;
        one = msg.sender;
        two = _two;
    }

    function () {
        uint amount = this.balance / 3;
        if (!one.call.value(amount)()) throw;
        if (!two.call.value(amount)()) throw;
    }
}
```
1. Why split in 3 when you want to split between two addresses? Is this to take some charge for handling the splitting, if so there is not storing of the third part.
2. The problem with call value and not specifying any gas, is that the reciever, could be a contract, and have a malicious fallback function. This fallback function could eat all the gas. This could be solved by specifying the amount of gas sendt with the call, but then we have the problem of not knowing how deep the layers go in the recieving end.
3. There is no this.balance variable, and I believe it was rather ment to be like so you send money to a contract and it splits the value and sends it to parties. Then we need to use msg.value, rather than this.balance.
4. This is all based on fallback function, which has a limited amount of gas aquired to it, if we use send from outside this contract. But we could avoid that with the function that is used in our fallback function, call.value…. This allows for more gas usage
5. There is a logical problem with the thought that the splitter constructor will take value from the get go. There is no code that uses the msg.value so there is really no need to check it.
7. Since the constructor is not payable it throw and exception and not work anyway
