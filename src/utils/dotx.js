// import { useLoading } from '@hooks/use-loading';
// import { LOADING_KEYS } from '@store/ui';
import { useConnect } from '@stacks/connect-react';
// import { useNetwork } from '@hooks/use-network';
import { useCallback } from 'react';
// import { useHeyContract } from '@hooks/use-hey-contract';
// import { REQUEST_FUNCTION } from '@common/constants';
// import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
// import { useCurrentAddress } from '@hooks/use-current-address';

export function triggerLockStx(network, stxcontractaddres, functionArgs) {
  console.log("triggerLockStx: ", network, stxcontractaddres, functionArgs)
  // const address = useCurrentAddress();
  // const { setIsLoading } = useLoading(LOADING_KEYS.CLAIM_HEY);
  const { doContractCall } = useConnect();
  // const [contractAddress, contractName] = useHeyContract();
  // const network = useNetwork();

  const onFinish = useCallback(() => {
    // void setIsLoading(false);
    console.log("onFinish")
  }, []);
  // setIsLoading

  const onCancel = useCallback(() => {
    // void setIsLoading(false);
    console.log("onCancel")
  }, []);
  // setIsLoading

  return useCallback(() => {
    // void setIsLoading(true);
    console.log("inside useCallback");
    void doContractCall({
      stxcontractaddres,
      contractName: 'stxswap_v3',
      functionName: 'lockStx',
      functionArgs: functionArgs,
      onFinish,
      onCancel,
      network,
      // stxAddress: address,
    });
  }, [onFinish, network, onCancel, doContractCall]);

  // doContractCall({
  //   stxcontractaddres,
  //   contractName: 'stxswap_v2',
  //   functionName: 'lockStx',
  //   functionArgs: functionArgs,
  //   network,
  //   // stxAddress: address,
  // });

}