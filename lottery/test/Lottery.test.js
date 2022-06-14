const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            // Value is in Wei
            // To convert to Wei can use this function web3.utils.toWei('0.0001', 'eth')
            value: 1000
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[1], players[0]);
        assert.equal(players.length, 1);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: 1000
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: 1000
        });
        await lottery.methods.enter().send({
            from: accounts[3],
            value: 1000
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[1], players[0]);
        assert.equal(accounts[2], players[1]);
        assert.equal(accounts[3], players[2]);
        assert.equal(players.length, 3);
    });

    it('requires a minimum amount of Ether to enter', async () => {
            // It will fail if assertion will not happen which means
            // we are able to enter account with not expected price
            await assert.rejects(lottery.methods.enter().send({
                from: accounts[1],
                value: 100
            }));
            /* Another solution can be this code. In case of which
               if we are able to enter account with not expected price
               then throw will be executed and we see that something is wrong
            */
           /*
            try {
                    await lottery.methods.enter().send({
                    from: accounts[1],
                    value: 100
                });
                throw(false);
            } catch(err) {
                assert(err);
            }
            */
    });

    it('Pick winner caller is not manager', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: 1000
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: 1000
        });
        await assert.rejects(lottery.methods.pickWinner().send({
            from: accounts[1]
        }));
    });

    it('Check whole contract functionality', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: 1000
        });

        const initialBalance = await web3.eth.getBalance(accounts[1]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        assert.equal(parseInt(initialBalance) + parseInt(990), await web3.eth.getBalance(accounts[1]));
    });
});