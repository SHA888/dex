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
       uint filled;
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
        orders.push(
            Order(nextOrderId, msg.sender, side, ticker, amount, price)
        );

        // Bubble sort
        uint i = orders.length > 0 ? orders.length - 1 : 0;

        if (side == Side.BUY) {
            while(i > 0) {
                if(orders[i - 1].price > orders[i].price) {
                    break;
                }
                Order memory orderToMove = orders[i - 1];
                orders[i - 1] = orders[i];
                orders[i] = orderToMove;
                i--;
            }
        }
        else if (side == Side.SELL) {
            while(i > 0) {
                if(orders[i - 1].price < orders[i].price) {
                    break;
                }
                Order memory orderToMove = orders[i - 1];
                orders[i - 1] = orders[i];
                orders[i] = orderToMove;
                i--;
            }
        }

        nextOrderId++;

    }

    function createMarketOrder(Side side, bytes32 ticker, uint amount) public {
        require(balances[msg.sender][ticker] >= amount, "Insufficient balance");

        uint orderBookSide;
        if (side == Side.BUY) {
            orderBookSide = 1;
        }
        else {
            orderBookSide = 0;
        }
        Order[] storage orders = orderBook[ticker][orderBookSide];

        uint totalFilled;

        for (uint256 i = 0; i < orders.length && totalFilled < amount; i++) {
            // How much we can fill from order[i]
            // Update totalFilled;

            // Execute the trade & shift balances between buyer/seller
            // Verify that the buyer has enough ETH to cover the purchase (require)
        }        

        // Loop through the orderbook and remove 100% filled orders
    }

}