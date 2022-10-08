import { PopulatedTransaction } from "ethers";
import { Web3Storage } from "web3.storage";

export async function publishTransaction(tx: PopulatedTransaction): Promise<string> {
    console.log("tx to string", tx.toString());
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY5YzY4M0NlMGJGZUM4REY4MDlEN0EyMmM0NTY2NTRlNjA2MzM3Y0EiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyNDYxMzI5ODIsIm5hbWUiOiJuZXBodyJ9.zZ_2CkLtfdHCpfURlGxP6cKZamCH-EVPg99MaNNIw_0";
    const storage = new Web3Storage({ token });
    const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' });
    return storage.put([file]);
}
