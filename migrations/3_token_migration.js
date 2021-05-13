const Link = artifacts.require("Link");
const Dex = artifacts.require("Dex");

module.exports = async function (deployer, network, accounts) {
     await deployer.deploy(Link);


     // // Check the balance
     // let userBalance = await link.balanceOf(accounts[0]);
     // console.log(`The user balance is ${userBalance}`);

     // // Incerase allowance and check
     // await link.approve(wallet.address, 500, { from: accounts[0] })
     // const allowance = await link.allowance(accounts[0], wallet.address)
     // console.log(`The allowance granted to wallet is ${allowance}`);

     // await wallet.addToken(web3.utils.fromUtf8("LINK"), link.address);
     // await wallet.deposit(100, web3.utils.fromUtf8("LINK"), { from: accounts[0] });

     // // Check user balance and wallet balance
     // // User bal should be 900 / wallet 100

     // userBalance = await link.balanceOf(accounts[0]);
     // console.log(`The user balance is ${userBalance}`)

     // const contractErcBalance = await link.balanceOf(wallet.address);
     // console.log(`The user balance is ${contractErcBalance}`);


};
