import * as NephwSDK from "../src";
import { ethers } from "ethers";

describe('NEPHW SDK', function () {

  const provider = ethers.providers.getDefaultProvider();
  const erc20abi = [
    "function transfer(address receiver, uint256 amount) external"
  ];

  it('sdk functions', async () => {

    const ERC20Contract = new ethers.Contract("0xdAC17F958D2ee523a2206206994597C13D831ec7", erc20abi, provider);
    const transaction = await ERC20Contract.populateTransaction.transfer(
      "0x4Ed918C7800F5dc34d2C774f6EA5fbd15f1a94a7",
      100000
    );
    
    const transactionCid = await NephwSDK.publishTransaction(transaction);
    console.log('transaction cid', transactionCid);

  }).timeout(600000);

});
