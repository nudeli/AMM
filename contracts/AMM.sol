// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import "./IERC20.sol";
import "./ERC20.sol";

contract AMM is ERC20 {
    IERC20 public immutable tokenOne;
    IERC20 public immutable tokenTwo;

    uint256 public reserveOne;
    uint256 public reserveTwo;
    
    constructor(address _tokenOne, address _tokenTwo) 
        ERC20("4300 Liquidity Provider", "4300LPT", 18)
    {
        tokenOne = IERC20(_tokenOne);
        tokenTwo = IERC20(_tokenTwo);
    }

    function _update(uint256 _reserveOne, uint256 _reserveTwo) private {
        reserveOne = _reserveOne;
        reserveTwo = _reserveTwo;
    }

    function calculateSwap(address _tokenIn, uint256 _amountIn)
        external view
        returns (uint256 amountOut)
    {
        require(
            _tokenIn == address(tokenOne) || _tokenIn == address(tokenTwo),
            "invalid token"
        );
        require(_amountIn > 0, "amount in = 0");

        bool isTokenOne = _tokenIn == address(tokenOne);
        (uint256 reserveIn, uint256 reserveOut)
        = isTokenOne
            ? (reserveOne, reserveTwo)
            : (reserveTwo, reserveOne);

        // 0.3% fee
        uint256 amountInWithFee = (_amountIn * 997) / 1000;
        amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
    }

    function swap(address _tokenIn, uint256 _amountIn)
        external
        returns (uint256 amountOut)
    {
        require(
            _tokenIn == address(tokenOne) || _tokenIn == address(tokenTwo),
            "invalid token"
        );
        require(_amountIn > 0, "amount in = 0");

        bool isTokenOne = _tokenIn == address(tokenOne);
        (IERC20 tokenIn, IERC20 tokenOut, uint256 reserveIn, uint256 reserveOut)
        = isTokenOne
            ? (tokenOne, tokenTwo, reserveOne, reserveTwo)
            : (tokenTwo, tokenOne, reserveTwo, reserveOne);

        tokenIn.transferFrom(msg.sender, address(this), _amountIn);

        // 0.3% fee
        uint256 amountInWithFee = (_amountIn * 997) / 1000;
        amountOut =
            (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        tokenOut.transfer(msg.sender, amountOut);

        _update(
            tokenOne.balanceOf(address(this)), tokenTwo.balanceOf(address(this))
        );
    }

    function addLiquidity(uint256 _amountOne, uint256 _amountTwo)
        external
        returns (uint256 shares)
    {
        tokenOne.transferFrom(msg.sender, address(this), _amountOne);
        tokenTwo.transferFrom(msg.sender, address(this), _amountTwo);

        if (totalSupply == 0) {
            shares = _sqrt(_amountOne * _amountTwo);
        } else {
            shares = _min(
                (_amountOne * totalSupply) / reserveOne,
                (_amountTwo * totalSupply) / reserveTwo
            );
        }
        require(shares > 0, "shares = 0");

        _mint(msg.sender, shares);

        _update(
            tokenOne.balanceOf(address(this)), tokenTwo.balanceOf(address(this))
        );
    }

    function removeLiquidity(uint256 _shares)
        external
        returns (uint256 amountOne, uint256 amountTwo)
    {

        uint256 balOne = tokenOne.balanceOf(address(this));
        uint256 balTwo = tokenTwo.balanceOf(address(this));

        amountOne = (_shares * balOne) / totalSupply;
        amountTwo = (_shares * balTwo) / totalSupply;
        require(amountOne > 0 && amountTwo > 0, "amountOne or amountTwo = 0");

        _burn(msg.sender, _shares);
        _update(balOne - amountOne, balTwo - amountTwo);

        tokenOne.transfer(msg.sender, amountOne);
        tokenTwo.transfer(msg.sender, amountTwo);
    }

    function _sqrt(uint256 y) private pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        return x <= y ? x : y;
    }
}
