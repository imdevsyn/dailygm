import Web3 from 'web3';
import ABI from './abi.json'
import { Network, Alchemy } from "alchemy-sdk"

const settings = {
  apiKey: import.meta.env.VITE_API_KEY,
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

const CONTRACT_ADDRESS = '0xdAF63bDE4225380431f8e97a3D4c70a59a52BA54';

export async function getOwners() {
  try {
    const { owners } = await alchemy.nft.getOwnersForContract(CONTRACT_ADDRESS)
    return owners
  } catch (err) {
    console.error(`getOwners returned an error: ${err.message}`)
    return 0
  }
}

export async function getSupply() {
  try {
    const response = await alchemy.nft.getNftsForContract(CONTRACT_ADDRESS)
    return response
  } catch (err) {
    console.error(`getSupply returned an error: ${err.message}`)
    return 0
  }
}

export async function getTodayMints() {
  try {
    const transfers = await alchemy.nft.getTransfersForContract(CONTRACT_ADDRESS)
    return transfers
  } catch (err) {
    console.error(`getTodayMints returned an error: ${err.message}`)
  }
}

export async function getGms(provider, address) {
  if (provider && address) {
    try {
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from: address})
      return await contract.methods.getGms(address).call();
    } catch (err) {
      console.error(`getGms returned an error: ${err.message}`)
    }
  } else {
    return "Wallet not found or not connected"
  }
}

export async function publicMint(provider, address) {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from: address})
  return await contract.methods.mintGM()
  .send({
    gasPrice: "",
    gas: null
  })
}

export async function getTransactionHashes(provider, address) {
  if (provider && address) {
    try {
      const transferData = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: address,
        order: "desc",
        contractAddresses: [CONTRACT_ADDRESS],
        category: ["erc721"],
      })
      const { transfers } = transferData
      return transfers

    } catch (err) {
        console.log(`Error while searching events: ${err.message}`)
    }
  } else {
    return "Wallet not connected or not found"
  }
}

export async function getStreak(provider, address) {
  if (provider && address) {
    let gms = await getGms(provider, address);

    if (gms.length === 0) return 0;

    let dates = gms.map(ts => {
      const date = new Date(Number(ts) * 1000);
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    });

    dates = [...new Set(dates)];

    dates.sort((a, b) => a - b);

    const today = new Date();
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const yesterdayUTC = todayUTC - 86400000;

    const lastDate = dates[dates.length - 1];

    if (lastDate !== todayUTC && lastDate !== yesterdayUTC) {
      return 0;
    }

    let streak = 1;

    for (let i = dates.length - 1; i > 0; i--) {
      const currentDay = dates[i];
      const previousDay = dates[i - 1];

      const dayDifference = (currentDay - previousDay) / 86400000;

      if (dayDifference === 1) {
        streak++;
      } else if (dayDifference > 1) {
        break;
      }
    }

    return streak;
  } else {
    return 0
  }
}

export async function setMood(provider, address, user_mood) {
  if (provider && address) {
    const web3 = new Web3(provider)
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, 
      {
        from: address,
      })
    const mood = await contract.methods.setMood(user_mood).send(      {
      from: address,
      value: web3.utils.toWei("0.0001", "ether"),
      gasPrice: "",
      gas: null
    })

    const fullHex = mood.logs[0].data
    let stringHex = `0x${fullHex.slice(130, 194)}`
    stringHex = stringHex.replace(/0+$/, '')
    const decodedString = web3.utils.hexToUtf8(stringHex)
    return decodedString
  } else {
    console.error("Wallet not found or not connected")
  }
}

export async function getMood(provider, address) {
  try {
    const web3 = new Web3(provider)
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {from: address})
    const mood = await contract.methods.getMood(address).call()
    return mood
  } catch (error) {
    console.error(`getMood returned an error: ${error.message}`)
  }
}
