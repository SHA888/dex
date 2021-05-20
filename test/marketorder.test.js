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
            
        )
    // When creating a BUY market order, the buyer needs to have enough ETH for the trade
    it("Should throw an error when a sell market order without adequate token balance", async () => {
        let dex = await Dex.deployed()

        let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("LINK"));
        assert.equal( balance.toNumber(), 0, "Initial LINK balance is not 0");
    // Market orders can be submitted even if the order book is empty

    // Market orders should be filled until the oder book is empty or the market order is 100% filled

    // The eth balance of the buyer should decrease with the filled amount

    // The token balances of the limit order sellers should decrease with the filled amounts

    // Filled limit orders should be removed from the orderbook
})