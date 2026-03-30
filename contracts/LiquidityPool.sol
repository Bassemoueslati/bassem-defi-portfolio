// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPool is ERC20 {

    address public token0;
    address public token1;

    uint public reserve0;
    uint public reserve1;

    uint constant FEE = 3; // 0.3%

    constructor(address _token0, address _token1)
        ERC20("LP Token", "LPT")
    {
        token0 = _token0;
        token1 = _token1;
    }

    // ================================
    // ADD LIQUIDITY
    // ================================
    function addLiquidity(uint amount0, uint amount1) external returns (uint liquidity) {
        
        // transférer tokens vers pool
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);

        if (totalSupply() == 0) {
            liquidity = sqrt(amount0 * amount1);
        } else {
            liquidity = min(
                (amount0 * totalSupply()) / reserve0,
                (amount1 * totalSupply()) / reserve1
            );
        }

        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY");

        _mint(msg.sender, liquidity);

        reserve0 += amount0;
        reserve1 += amount1;
    }

    // ================================
    // SWAP (x * y = k)
    // ================================
    function swap(address tokenIn, uint amountIn) external returns (uint amountOut) {

        require(tokenIn == token0 || tokenIn == token1, "INVALID_TOKEN");

        bool isToken0 = tokenIn == token0;

        (uint reserveIn, uint reserveOut) = isToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        uint amountInWithFee = (amountIn * (1000 - FEE)) / 1000;

        amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);

        require(amountOut > 0, "INSUFFICIENT_OUTPUT");

        address tokenOut = isToken0 ? token1 : token0;

        IERC20(tokenOut).transfer(msg.sender, amountOut);

        // update reserves
        if (isToken0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }
    }

    // ================================
    // REMOVE LIQUIDITY
    // ================================
    function removeLiquidity(uint liquidity) external returns (uint amount0, uint amount1) {

        uint supply = totalSupply();

        amount0 = (liquidity * reserve0) / supply;
        amount1 = (liquidity * reserve1) / supply;

        require(amount0 > 0 && amount1 > 0, "INSUFFICIENT_AMOUNT");

        _burn(msg.sender, liquidity);

        reserve0 -= amount0;
        reserve1 -= amount1;

        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);
    }

    // ================================
    // HELPERS
    // ================================
    function min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }

    function sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
