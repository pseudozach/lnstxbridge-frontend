import QRious from 'qrious';

export const createRefundQr = (
  currency,
  privateKey,
  redeemScript,
  timeoutBlockHeight,
  preimageHash,
  amount,
  contract,
  swapInfo,
  swapResponse,
) => {
  // console.log("createrefundqr: ", preimageHash, amount)
  const jsonData = JSON.stringify({
    currency,
    privateKey,
    redeemScript,
    timeoutBlockHeight,
    preimageHash,
    amount,
    contract,
    swapInfo,
    swapResponse,
  });

  // console.log('refundutils createqr ', jsonData);
  let swapId = amount?.id;
  localStorage.setItem(swapId, jsonData);

  // save all ids here
  const swaplist = localStorage.getItem('lnswaps');
  localStorage.setItem('lnswaps', `${swapId},${swaplist}`);

  // reqobj = {
  //   type: 'submarine',
  //   pairId: pair.id,
  //   orderSide: pair.orderSide,
  //   claimAddress: invoice,
  //   refundPublicKey: keys.publicKey,
  //   preimageHash,
  //   requestedAmount: parseInt(quoteAmount * 1000000) + '',
  //   baseAmount: baseAmount,
  //   quoteAmount: quoteAmount,
  // };

  const qr = new QRious({
    size: 500,
    level: 'L',
    value: jsonData,
    background: 'white',
    foreground: 'black',
    backgroundAlpha: 1,
    foregroundAlpha: 1,
  });

  return qr.toDataURL();
};
