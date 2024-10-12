import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import { Toaster } from "./components/ui/toaster.jsx"
import "./global.css"

import '@rainbow-me/rainbowkit/styles.css';
import {  RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { structuralSharing } from '@wagmi/core/query';
import { http } from 'wagmi'


const config = getDefaultConfig({
  appName: 'DailyGM',
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [base],
  ssr: true, 
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_API_KEY}`),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      structuralSharing,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} locale="en-US" showRecentTransactions={true}>
          <App />
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
