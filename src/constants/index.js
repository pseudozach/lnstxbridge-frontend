import { Networks } from 'boltz-core';

const capitalizeFirstLetter = input => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const SwapUpdateEvent = {
  InvoicePaid: 'invoice.paid',
  InvoiceSettled: 'invoice.settled',
  InvoiceFailedToPay: 'invoice.failedToPay',

  TransactionFailed: 'transaction.failed',
  TransactionMempool: 'transaction.mempool',
  TransactionClaimed: 'transaction.claimed',
  TransactionRefunded: 'transaction.refunded',
  TransactionConfirmed: 'transaction.confirmed',
  TransactionLockupFailed: 'transaction.lockupFailed',

  ASTransactionFailed: 'astransaction.failed',
  ASTransactionMempool: 'astransaction.mempool',
  ASTransactionClaimed: 'astransaction.claimed',
  ASTransactionRefunded: 'astransaction.refunded',
  ASTransactionConfirmed: 'astransaction.confirmed',

  SwapExpired: 'swap.expired',

  MinerFeePaid: 'minerfee.paid',

  ChannelCreated: 'channel.created',
};

export const ServiceWarnings = {
  ReverseSwapsDisabled: 'reverse.swaps.disabled',
};

/**
 * Values from the environment
 */

// Onion URL
export const boltzOnion = process.env.REACT_APP_BOLTZ_ONION;

// Network Type
export const stacksNetworkType = process.env.REACT_APP_STACKS_NETWORK_TYPE;

export const coreApiUrl = () => {
  let apiUrl = 'https://stacks-node-api.mainnet.stacks.co';
  if (stacksNetworkType === 'mocknet') {
    apiUrl = 'http://localhost:3999';
  } else if (stacksNetworkType === 'testnet') {
    apiUrl = 'https://stacks-node-api.testnet.stacks.co';
  } else if (stacksNetworkType === 'mainnet') {
    apiUrl = 'https://stacks-node-api.mainnet.stacks.co';
  }
  return apiUrl;
};

// API endpoint; will be set to the onion endpoint if Boltz is accessed via Tor
const splitHost = window.location.hostname.split('.');

if (splitHost[0] === 'www') {
  splitHost.shift();
}

export const boltzApi =
  splitHost[1] !== 'onion'
    ? process.env.REACT_APP_BOLTZ_API
    : process.env.REACT_APP_BOLTZ_API_ONION;

// LND node URIs
export const bitcoinLnd = process.env.REACT_APP_BITCOIN_LND;
export const bitcoinLndOnion = process.env.REACT_APP_BITCOIN_LND_ONION;

export const litecoinLnd = process.env.REACT_APP_LITECOIN_LND;
export const litecoinLndOnion = process.env.REACT_APP_LITECOIN_LND_ONION;

// Network configurations
export const network = process.env.REACT_APP_NETWORK;

export const bitcoinNetwork =
  Networks[`bitcoin${capitalizeFirstLetter(network)}`];
export const litecoinNetwork =
  Networks[`litecoin${capitalizeFirstLetter(network)}`];

export const bitcoinExplorer = process.env.REACT_APP_BITCOIN_EXPLORER;
export const litecoinExplorer = process.env.REACT_APP_LITECOIN_EXPLORER;
export const stacksExplorer = process.env.REACT_APP_STACKS_EXPLORER;

// Sample values
export const lockupTransactionHash =
  process.env.REACT_APP_LOCKUP_TRANSACTION_HASH;

export const bitcoinAddress = process.env.REACT_APP_BITCOIN_ADDRESS;
export const litecoinAddress = process.env.REACT_APP_LITECOIN_ADDRESS;

export const bitcoinInvoice = process.env.REACT_APP_BITCOIN_INVOICE;
export const litecoinInvoice = process.env.REACT_APP_LITECOIN_INVOICE;

// contracts!
export const rbtcswapaddress = process.env.REACT_APP_RBTCSWAP_ADDRESS;
export const erc20swapaddress = process.env.REACT_APP_ERC20SWAP_ADDRESS;
export const erc20tokenaddress = process.env.REACT_APP_ERC20TOKEN_ADDRESS;
export const boltzAddress = process.env.REACT_APP_BOLTZ_ADDRESS;

export const sampleStacksTxId =
  '0x8a7e35f55c72d672982e5c0355783c55d7958a4fa3fdf54cc90356269eed9316';
