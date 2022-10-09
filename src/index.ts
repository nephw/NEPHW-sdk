import { PopulatedTransaction } from "ethers";
import { Web3Storage } from "web3.storage";
import { UUID } from 'uuid-generator-ts';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY5YzY4M0NlMGJGZUM4REY4MDlEN0EyMmM0NTY2NTRlNjA2MzM3Y0EiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyNDYxMzI5ODIsIm5hbWUiOiJuZXBodyJ9.zZ_2CkLtfdHCpfURlGxP6cKZamCH-EVPg99MaNNIw_0";
const storage = new Web3Storage({ token });

export interface CreateTransactionRequest {
    tx: PopulatedTransaction;
    chainId: number;
}

export interface TransactionRequest {
    tx: PopulatedTransaction;
    requestId: string;
}

// interface TransactionRequestWithStatus {
//     tx: PopulatedTransaction;
//     requestId: string;
//     status: string;
// }

export async function publishTransactionFlow(
    transactions: CreateTransactionRequest[]
): Promise<string> {
    const uuid = new UUID();
    const txFlow = JSON.stringify({
        transactions: transactions.map(it => {
            it.tx.chainId = it.chainId;
            return {
                tx: it.tx,
                requestId: uuid.getDashFreeUUID()
            };
        })
    });

    const file = new File( [txFlow], 'flow.json', { type: 'application/json'} );
    return storage.put([file]);
}

export async function getTransactionFlow(
    cid: string
): Promise<TransactionRequest[]> {
    const response = await storage.get(cid)
    if (!response) { Promise.reject(`NephwSDK:: Transaction with cid ${cid} not found.`); }
    const files = await response!.files();
    if (!files) { Promise.reject(`NephwSDK:: Transaction with cid ${cid} contains no files.`); }
    const file = files[0];
    const data = await file.text();
    const transactions = JSON.parse(data) as TransactionRequest[];
    return transactions;
}

export async function setCompleted(
    transactionRequest: TransactionRequest
): Promise<string> {
    const transactionRequestWithStatus = JSON.stringify({
        ...transactionRequest,
        status: 'COMPLETED'
    });
    const file = new File( [transactionRequestWithStatus], 'status.json', { type: 'application/json'} );
    return storage.put([file]);
}

// async function withStatus(txRequest: TransactionRequest): Promise<TransactionRequestWithStatus> {
//     fs.writeFileSync('./transaction.json', JSON.stringify({
//         ...txRequest,
//         status: 'COMPLETED'
//     }));

// }
