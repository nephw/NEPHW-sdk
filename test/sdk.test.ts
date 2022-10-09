import * as NephwSDK from "../src";
import { ethers } from "ethers";

describe('NEPHW SDK', function () {

  const provider = ethers.providers.getDefaultProvider();
  const erc20abi = [
    "function transfer(address receiver, uint256 amount) external"
  ];

  it('sdk functions', async () => {
    const ERC20Contract = new ethers.Contract("0xdAC17F958D2ee523a2206206994597C13D831ec7", erc20abi, provider);
    const transaction1 = await ERC20Contract.populateTransaction.transfer(
      "0x4Ed918C7800F5dc34d2C774f6EA5fbd15f1a94a7",
      100000
    );
    const transaction2 = await ERC20Contract.populateTransaction.transfer(
      "0x4Ed918C7800F5dc34d2C774f6EA5fbd15f1a94a7",
      200000
    );
    
    const transactionFlowCid = await NephwSDK.publishTransactionFlow([
      {
        tx: transaction1,
        chainId: 1
      },
      {
        tx: transaction2,
        chainId: 5
      }
    ]);
    console.log('transaction cid', transactionFlowCid);

    const fetchedTx = await NephwSDK.getTransactionFlow(transactionFlowCid);
    console.dir(fetchedTx, { depth: null });

  }).timeout(600000);

});
