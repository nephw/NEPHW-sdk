import { PopulatedTransaction } from "ethers";
import { Web3Storage } from "web3.storage";


const uuid = require('uuid');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY5YzY4M0NlMGJGZUM4REY4MDlEN0EyMmM0NTY2NTRlNjA2MzM3Y0EiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyNDYxMzI5ODIsIm5hbWUiOiJuZXBodyJ9.zZ_2CkLtfdHCpfURlGxP6cKZamCH-EVPg99MaNNIw_0";
const storage = new Web3Storage({ token });


interface CreateTransactionRequest {
    tx: PopulatedTransaction;
    chainId: number;
}

interface TransactionRequest {
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

    
    const txFlow = JSON.stringify({
        transactions: transactions.map(it => {
            it.tx.chainId = it.chainId;
            return {
                tx: it.tx,
                requestId: uuid.v4()
            };
        })
    });

    const file = new File( [txFlow], 'flow.json', { type: 'application/json'} );
    return storage.put([file]);
    // return storage.put([ new File([txFlow], 'flow.json', { type: 'text/plain' }) ]);
    // fs.writeFileSync('./transaction.json', txFlow);
    // const files = await getFilesFromPath('./transaction.json');
    // return storage.put(files);
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
    // const transactionsWithStatuses = transactions.map(t => {
    //     return 
    // });

    return transactions;
}

// async function withStatus(txRequest: TransactionRequest): Promise<TransactionRequestWithStatus> {
//     fs.writeFileSync('./transaction.json', JSON.stringify({
//         ...txRequest,
//         status: 'COMPLETED'
//     }));

// }
