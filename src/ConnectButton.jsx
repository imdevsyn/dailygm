import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,  
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance, 
} from '@coinbase/onchainkit/identity';
import '@coinbase/onchainkit/styles.css';

 
export function WalletComponents() {
  return (
    <Wallet>
      <ConnectWallet className="bg-gray-900 text-white">
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletDropdown className="bg-gray-900 text-white" >
        <Identity 
          className="flex px-4 pt-3 pb-2" 
          hasCopyAddressOnClick
        >
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownBasename />
        <WalletDropdownLink
          icon="wallet"
          href="https://keys.coinbase.com"
          className=""
        >
          Wallet
        </WalletDropdownLink>
        <div>
          <WalletDropdownDisconnect />
        </div>
      </WalletDropdown>
    </Wallet>
  );
}