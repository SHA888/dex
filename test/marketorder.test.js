const Dex = artifacts.require("Dex")
const Link = artifacts.require("Link")
const truffleAssert = artifacts.require("truffle-assertion");

contract("Dex", account => {
    // When creating a SELL market order, the seller needs to have enough tokens for the trade
    it("Should throw an error when a sell market order without adequate token balance", async () => {
        let dex = await Dex.deployed()

        let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("LINK"));
        assert.equal( balance.toNumber(), 0, "Initial LINK balance is not 0");

        await truffleAssert.reverts(
            dex.createMarketOrder(1, web3.utils.fromUtf8("LINK"), 10)
        )
    })

    // Market orders can be submitted even if the order book is empty
    it("Market orders should not fill more limit orders than the market order amount", async() => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); // Get sell side orderbook
        assert(orderbook.length == 0, "Sell side Orderbook should be empty at start of test");

        await dex.addToken(web3.utils.fromUtf8("LINK"), link.address)

        // Send LINK tokens to accounts 1, 2, 3 from account 0
        await link.transfer(accounts[1], 150)
        await link.transfer(accounts[2], 150)
        await link.transfer(accounts[3], 150)

        // Approve DEX for accounts 1, 2, 3
        await link.approve(dex.address, 50, {from: accounts[1]});
        await link.approve(dex.address, 50, {from: accounts[2]});
        await link.approve(dex.address, 50, {from: accounts[3]});

        // Deposit LINK into DEX for accounts 1, 2, 3
        await dex.deposit(50, web3.utils.fromUtf8("LINK"), {from: accounts[1]});
        await dex.deposit(50, web3.utils.fromUtf8("LINK"), {from: accounts[2]});
        await dex.deposit(50, web3.utils.fromUtf8("LINK"), {from: accounts[3]});

        // Fill up the sell order book
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 300, {from: accounts[1]});
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 400, {from: accounts[2]});
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 500, {from: accounts[3]});

        // Create market order that should fill 2/3 orders in the book
        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 10);

        orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); // Get sell side orderbook
        assert(orderbook.length == 1, "Sell side Orderbook should only only have 1 order left");
        assert(orderbook[0].filled == 0, "Sell side order should have 0 filled");
    })

    // Market orders should be filled until the order book is empty or the market order is 100% filled
    it("Market orders should be filled until the book order is empty", async () => {
        let dex = await Dex.deployed()

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1); // Get sell side orderbook
        assert(orderbook.length == 1, "Sell side Orderbook should have 1 order left");

        // Fill up the sell order book again
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 400, {from: accounts[1]})
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 5, 500, {from: accounts[2]})

        // Check buyer LINK balance before LINK purchase
        let balanceBefore = await dex.balances(accounts[0], web3.utils.fromUtf8("LINK"))

        // Create market order that could fill more than the entire order book (15 link)
        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 50);

        // Check buyer LINK balance after LINK purchase 
        let balanceAfter = await dex.balances(accounts[0], web3.utils.fromUtf8("LINK"))

        // Buyer should have 15 more LINK after, even though order was 50
        assert.equal(balanceBefore.toNumber() + 15, balanceAfter.toNumber());
    })

    // The eth balance of the buyer should decrease with the filled amounts

    // The token balances of the limit order sellers should decrease with the filled amounts

    // Filled limit orders should be removed from the order book

    // Partly filled limit orders should be modified to represent the filled/ remaining amount

    // When creating a BUY market order, the buyer needs tho have enough ETH for the trade
})