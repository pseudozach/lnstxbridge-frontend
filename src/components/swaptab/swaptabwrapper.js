import React from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { ServiceWarnings } from '../../constants';
import { decimals } from '../../utils';
import Web3 from 'web3';
import Web3Modal from "web3modal";

import { ContractABIs } from 'boltz-core';
// // @ts-ignore 
// import { ERC20 } from 'boltz-core/typechain/ERC20';
// import { ERC20Swap } from 'boltz-core/typechain/ERC20Swap';
// import { EtherSwap } from 'boltz-core/typechain/EtherSwap';
import { Signer, providers, Contract, Wallet } from 'ethers';

import {
  erc20tokenaddress,
  rbtcswapaddress,
  erc20swapaddress,
} from '../../constants';

class SwapTabWrapper extends React.Component {
  constructor(props) {
    super(props);

    if (props.warnings.includes(ServiceWarnings.ReverseSwapsDisabled)) {
      this.reverseSwapsDisabled = true;
    }

    this.quoteStep = new BigNumber('0.0001').toFixed(4);
    this.baseStep = new BigNumber('1').dividedBy(decimals).toFixed(8);

    this.state = {
      baseAsset: {},
      quoteAsset: {},
      disabled: false,
      error: false,
      inputError: false,
      base: 'SOV',
      quote: 'BTC ⚡',
      minAmount: new BigNumber('0'),
      maxAmount: new BigNumber('0'),
      baseAmount: new BigNumber('0.05'),
      quoteAmount: new BigNumber('0'),
      feeAmount: new BigNumber('0'),
      errorMessage: '',
      web3: null,
      provider: null,
    };
  }

  connectWallet = async () => {
    const providerOptions = {
      /* See Provider Options Section */
    };

    const web3Modal = new Web3Modal({
      // network: "mainnet", // optional
      // cacheProvider: true, // optional
      // providerOptions // required
    });
    // console.log("web3modal defined");
    const provider = await web3Modal.connect();
    console.log("web3 provider ready: ", provider);
    this.provider = provider;

    const web3 = new Web3(provider);
    console.log("web3 ready: ", web3);
    this.web3 = web3;

    console.log("web3.eth.accounts.currentProvider.selectedAddress ", web3.eth.accounts.currentProvider.selectedAddress);


    var erc20swapabi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"preimage","type":"bytes32"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"claimAddress","type":"address"},{"indexed":true,"internalType":"address","name":"refundAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"Lockup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"}],"name":"Refund","type":"event"},{"inputs":[{"internalType":"bytes32","name":"preimage","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"hashValues","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address payable","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lockPrepayMinerfee","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"swaps","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}];
    var erc20swapcontract = new web3.eth.Contract(erc20swapabi, erc20swapaddress);
    console.log(erc20swapcontract.methods.lock)


  }  

  lockFunds = async (swapInfo, swapResponse) => {
    console.log("enter lockFunds, swapInfo, swapResponse ", swapInfo, swapResponse);
    if(!this.web3) {
      this.connectWallet();
    }

    console.log("got web3: ", this.web3);

    // const signer = this.connectEthereum(this.provider, this.provider.address);
    // const { etherSwap, erc20Swap, token } = this.getContracts(signer);
  
    const preimageHash = "this.getHexBuffer(argv.preimageHash)";
    const amount = "BigNumber.from(argv.amount).mul(etherDecimals)";
  
    const boltzAddress = "await getBoltzAddress()";
    console.log("boltzAddress: ", boltzAddress);
  
    if (boltzAddress === undefined) {
      console.log('Could not lock coins because the address of Boltz could not be queried');
      return;
    }
  
    var erc20swapabi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"preimage","type":"bytes32"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"claimAddress","type":"address"},{"indexed":true,"internalType":"address","name":"refundAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"Lockup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"}],"name":"Refund","type":"event"},{"inputs":[{"internalType":"bytes32","name":"preimage","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"hashValues","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address payable","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lockPrepayMinerfee","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"swaps","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}];
    var erc20swapcontract = this.web3.eth.contract(erc20swapabi).at(erc20swapaddress);

    console.log("web3.eth.accounts[0] ", this.web3.eth.accounts[0]);
    
    // erc20swapcontract.lock.sendTransaction(parameter_1,parameter_2,parameter_n,{
    //             from:web3.eth.accounts[0],
    //             gas:4000000},function (error, result){ //get callback from function which is your transaction key
    //                 if(!error){
    //                     console.log(result);
    //                 } else{
    //                     console.log(error);
    //                 }
    //         });



    // let transaction;
    // : ContractTransaction;
  
    // if (argv.token) {
    //   console.log("rsk erc20Swap.lock to erc20SwapAddress: ", Constants.erc20SwapAddress);
    //   await token.approve(Constants.erc20SwapAddress, amount);
    //   console.log("rsk erc20Swap.lock after approve: ", preimageHash, amount, Constants.erc20TokenAddress, boltzAddress, argv.timelock);
    //   transaction = await erc20Swap.lock(
    //     preimageHash,
    //     amount,
    //     Constants.erc20TokenAddress,
    //     boltzAddress,
    //     argv.timelock,
    //   );
    // } else {
    //   console.log("rsk etherSwap.lock to claimAddress: ", boltzAddress);
    //   transaction = await etherSwap.lock(
    //     preimageHash,
    //     boltzAddress,
    //     argv.timelock,
    //     {
    //       value: amount,
    //     },
    //   );
    // }
  
    // await transaction.wait(1);
    // console.log(`Sent ${argv.token ? 'ERC20 token' : 'Rbtc'} in: ${transaction.hash}`);
  }

  // connectEthereum = (providerUrl, signerAddress) => {
  //   const provider = new providers.JsonRpcProvider(providerUrl);
  //   console.log("rsk connectEthereum signerAddress: ", signerAddress);
  //   return provider.getSigner(signerAddress);
  // };
  
  // getContracts = (signer) => {
  //   return {
  //     token: new Contract(
  //       erc20tokenaddress,
  //       ContractABIs.ERC20,
  //       signer,
  //     ), 
  //     // as any as ERC20,
  //     etherSwap: new Contract(
  //       rbtcswapaddress,
  //       ContractABIs.EtherSwap,
  //       signer,
  //     ),
  //     //  as any as EtherSwap,
  //     erc20Swap: new Contract(
  //       erc20swapaddress,
  //       ContractABIs.ERC20Swap,
  //       signer,
  //     )
  //     //  as any as ERC20Swap,
  //   };
  // };

  getHexBuffer = (input) => {
    return Buffer.from(input, 'hex');
  };

  updateAssets = (isBase, symbol, isLightning) => {
    if (isBase) {
      this.baseAsset = {
        symbol,
        isLightning,
      };
    } else {
      this.quoteAsset = {
        symbol,
        isLightning,
      };
    }
  };

  parseBoltSuffix = (entry, isBase) => {
    const index = entry.lastIndexOf('⚡');
    const isLightning = index !== -1;

    const symbol = isLightning ? entry.substr(0, index - 1) : entry;

    this.updateAssets(isBase, symbol, isLightning);

    return symbol;
  };

  getSymbol = () => {
    return `${this.parseBoltSuffix(
      this.state.base,
      true
    )}/${this.parseBoltSuffix(this.state.quote, false)}`;
  };

  componentWillMount = () => {
    if (localStorage.getItem('quote')) {
      this.setState({
        base: localStorage.getItem('base'),
        quote: localStorage.getItem('quote'),
        baseAmount: new BigNumber(localStorage.getItem('baseAmount')),
      });
    }
  };

  componentDidMount = () => {
    const symbol = this.getSymbol();
    const limits = this.props.limits[symbol];
    console.log("symbol, limits ", symbol, limits);
    this.setState(
      {
        minAmount: new BigNumber(limits.minimal),
        maxAmount: new BigNumber(limits.maximal),
        rate: this.props.rates[symbol],
      },
      () => {
        this.updateQuoteAmount(this.state.baseAmount);
        this.componentDidUpdate({}, {});
      }
    );
  };

  componentDidUpdate = (_, prevState) => {
    const { base, quote, baseAmount, inputError } = this.state;

    // If rate is undefined disable input
    if (this.state.rate !== prevState.rate) {
      this.noRateAvailable();
    }

    // Update the rate if the request finished or the currencies changed
    if (
      prevState.base !== this.state.base ||
      prevState.quote !== this.state.quote
    ) {
      const symbol = this.getSymbol();

      // Swapping from chain to chain or from Lightning to Lightning is not supported right now
      if (
        base === quote ||
        (this.baseAsset.isLightning && this.quoteAsset.isLightning)
      ) {
        this.setState({
          rate: undefined,
          error: true,
          errorMessage: 'Choose a different asset',
        });
        return;
      }

      if (!this.baseAsset.isLightning && !this.quoteAsset.isLightning) {
        this.setState({
          rate: undefined,
          error: true,
          errorMessage: 'Coming soon',
        });
        return;
      }

      // Show an error for reverse swaps if they are disabled
      if (this.reverseSwapsDisabled && this.baseAsset.isLightning) {
        this.setState({
          rate: undefined,
          error: true,
          errorMessage: 'Currently not available',
        });
        return;
      }

      if (inputError) {
        this.setState({
          error: true,
          errorMessage: 'Invalid amount',
        });
      }

      const rate = this.props.rates[symbol];
      const limits = this.props.limits[symbol];
      const feePercentage = this.props.fees.percentages[symbol];
      this.setState(
        {
          rate,
          feePercentage,
          minAmount: new BigNumber(limits.minimal).dividedBy(decimals),
          maxAmount: new BigNumber(limits.maximal).dividedBy(decimals),
          error: false,
        },
        () => this.updateQuoteAmount(this.state.baseAmount)
      );
    }

    if (!this.state.inputError && !this.state.error) {
      localStorage.setItem('base', base);
      localStorage.setItem('quote', quote);
      localStorage.setItem('baseAmount', baseAmount);
    }
  };

  /**
   * @returns the miner fee in the smallest denomination of the currency
   */
  calculateMinerFee = () => {
    const { minerFees } = this.props.fees;

    if (this.baseAsset.isLightning) {
      const { lockup, claim } = minerFees[this.quoteAsset.symbol].reverse;

      return lockup + claim;
    } else {
      return minerFees[this.baseAsset.symbol].normal;
    }
  };

  /**
   * @param { BigNumber } baseAmount
   * @param { BigNumber } rate
   */
  calculateFee = (baseAmount, rate) => {
    const feePercentage = new BigNumber(this.state.feePercentage);

    const percentageFee = feePercentage.times(baseAmount);

    let minerFee = new BigNumber(this.calculateMinerFee()).dividedBy(decimals);

    if (this.baseAsset.isLightning) {
      minerFee = minerFee.times(new BigNumber(1).dividedBy(rate));
    }

    if (isNaN(percentageFee.toNumber())) {
      return new BigNumber(0);
    }

    return percentageFee.plus(minerFee);
  };

  /**
   * @param { BigNumber } baseAmount
   */
  checkBaseAmount = baseAmount => {
    const { minAmount, maxAmount } = this.state;

    return (
      baseAmount.isLessThanOrEqualTo(maxAmount) &&
      baseAmount.isGreaterThanOrEqualTo(minAmount)
    );
  };

  updatePair = (quote, base) => {
    this.setState({ base, quote, error: false, errorMessage: '' });
  };

  noRateAvailable = () => {
    this.state.rate
      ? this.setState({ disabled: false })
      : this.setState({ disabled: true });
  };

  updateBaseAmount = quoteAmount => {
    const amount = new BigNumber(quoteAmount);
    const rate = new BigNumber(this.state.rate.rate);

    const newBase = amount.dividedBy(rate);
    const fee = this.calculateFee(newBase, rate);

    const newBaseWithFee = fee.plus(newBase);
    const inputError = !this.checkBaseAmount(newBaseWithFee);

    this.setState({
      quoteAmount: amount,
      baseAmount: new BigNumber(newBaseWithFee.toFixed(8)),
      feeAmount: fee,
      inputError,
      errorMessage: 'Invalid amount',
    });
  };

  updateQuoteAmount = baseAmount => {
    if (!this.state.rate) return;

    const amount = new BigNumber(baseAmount.toString());
    const rate = new BigNumber(this.state.rate.rate);

    let fee = this.calculateFee(amount, rate);

    const quote = amount
      .times(rate)
      .minus(fee.times(rate))
      .toFixed(8);

    let newQuote = new BigNumber(quote);

    if (newQuote.isLessThanOrEqualTo(0)) {
      newQuote = new BigNumber('0');
    }

    const inputError = !this.checkBaseAmount(amount);
    this.setState({
      quoteAmount: newQuote,
      baseAmount: amount,
      feeAmount: fee,
      inputError,
      errorMessage: 'Invalid amount',
    });
  };

  shouldSubmit = () => {
    const { error, rate, baseAmount, quoteAmount } = this.state;
    if (error === false && this.rate !== 'Not found') {
      const state = {
        baseAmount: baseAmount.toFixed(8),
        quoteAmount: quoteAmount.toFixed(8),
        base: this.baseAsset.symbol,
        quote: this.quoteAsset.symbol,
        isReverseSwap: this.baseAsset.isLightning,
        pair: {
          id: rate.pair,
          orderSide: rate.orderSide,
        },
      };

      this.props.onPress(state);
    }
  };

  parseRate = () => {
    const rate = this.state.rate;

    if (rate) {
      const exactRate = new BigNumber(rate.rate);
      return exactRate.toFixed(5);
    } else {
      return 'Not found';
    }
  };

  switchPair = () => {
    this.setState(
      state => ({
        base: state.quote,
        quote: state.base,
        baseAmount: state.quoteAmount,
      }),
      () => this.updateQuoteAmount(this.state.baseAmount)
    );
  };

  render() {
    const { feeAmount } = this.state;
    const feePercentage = this.props.fees.percentages[this.getSymbol()] * 100;

    return this.props.children({
      feePercentage,
      quote: this.state.quote,
      disabled: this.state.disabled,
      base: this.state.base,
      errorMessage: this.state.errorMessage,
      error: this.state.error,
      inputError: this.state.inputError,
      minAmount: this.state.minAmount.toNumber(),
      maxAmount: this.state.maxAmount.toNumber(),
      feeAmount: feeAmount.isZero() ? 0 : feeAmount.toFixed(8),
      quoteAmount: this.state.quoteAmount.toNumber(),
      baseAmount: this.state.baseAmount.toNumber(),
      classes: this.props.classes,
      onPress: this.props.onPress,
      limits: this.props.limits,
      currencies: this.props.currencies,
      rate: this.parseRate(),
      updateQuoteAmount: this.updateQuoteAmount,
      updateBaseAmount: this.updateBaseAmount,
      switchPair: this.switchPair,
      updatePair: this.updatePair,
      shouldSubmit: this.shouldSubmit,
      connectWallet: this.connectWallet,
      lockFunds: this.lockFunds,
      baseStep: this.baseStep,
      quoteStep: this.quoteStep,
    });
  }
}

SwapTabWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  classes: PropTypes.object,
  warnings: PropTypes.array.isRequired,
  onPress: PropTypes.func,
  fees: PropTypes.object.isRequired,
  rates: PropTypes.object.isRequired,
  limits: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
};

export default SwapTabWrapper;
