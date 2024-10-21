import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,  
  WalletDropdownLink,
  WalletDropdownDisconnect,
  ConnectWalletText,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance, 
} from '@coinbase/onchainkit/identity';
import '@coinbase/onchainkit/styles.css';
import { color } from '@coinbase/onchainkit/theme';

 
export function WalletComponents() {
  return (
    <Wallet>
      <ConnectWallet withWalletAggregator className="bg-gray-900 hover:bg-gray-900">
        <ConnectWalletText className="text-white">Connect Wallet</ConnectWalletText>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletDropdown className="" >
        <Identity 
          className="flex px-4 pt-3 pb-2" 
          hasCopyAddressOnClick
        >
          <Avatar />
          <Name />
          <Address className={color.foregroundMuted} />
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