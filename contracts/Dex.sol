// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./Wallet.sol";

contract Dex is Wallet {

    using SafeMath for uint256;

    enum Side {
        BUY,
        SELL
    }

    struct Order {
       uint id;
       address trader;
       Side side;
    //    bool buyOrder;
       bytes32 ticker;
       uint amount;
       uint price;
    }

    uint public nextOrderId = 0;

    mapping(bytes32 => mapping(uint => Order[])) public orderBook;

    function getOrderBook(bytes32 ticker, Side side) view public returns(Order[] memory) {
        return orderBook[ticker][uint(side)];
    }

    function createLimitOrder(Side side, bytes32 ticker, uint amount, uint price) public {
        if(side == Side.BUY) {
            require(balances[msg.sender]["ETH"] >= amount.mul(price));
        }

        else if(side == Side.SELL) {
            require(balances[msg.sender][ticker] >= amount);
        }

        Order[] storage orders = orderBook[ticker][uint(side)];
        // list of the orders
        order.push(
            Order(nextOrderId_, msg.sender, side, ticker, amount, price)
        );

        // Bubble sort
        if (side == side.BUY) {
            
        }
        else if (side == side.SELL) {

        } 

        nextOrderId++;

    }

}