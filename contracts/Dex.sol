// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Dex {
    struct Pool {
        uint reserve0;
        uint reserve1;
    }

    mapping(bytes32 => Pool) public pools;

    function getKey(address tokenA, address tokenB) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenA, tokenB));
    }

    function addLiquidity(address tokenA, address tokenB, uint amountA, uint amountB) external {
        bytes32 key = getKey(tokenA, tokenB);
        pools[key].reserve0 += amountA;
        pools[key].reserve1 += amountB;
    }

    function swap(address tokenA, address tokenB, uint amountIn) external returns (uint amountOut) {
        bytes32 key = getKey(tokenA, tokenB);
        Pool storage pool = pools[key];

        uint amountInWithFee = amountIn * 997 / 1000;
        amountOut = (amountInWithFee * pool.reserve1) / (pool.reserve0 + amountInWithFee);

        pool.reserve0 += amountIn;
        pool.reserve1 -= amountOut;
    }
}
