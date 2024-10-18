import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { ScrollArea } from "./components/ui/scroll-area"
import { useToast  } from "./components/hooks/use-toast"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import {Tooltip} from "@nextui-org/tooltip";

import BaseLogo from "./assets/Base_Logo.svg"
import SunIcon from "./assets/sun.svg"
import CheckIcon from "./assets/check-circle-removedbg.png"
import EthIcon from './assets/ethereum.png'
import DailyGmLogo from "./assets/dailygm-3.png"
import XLogo from "./assets/x-logo.png"
import {Users, Activity, Sun, LoaderCircle, CircleHelp, MessageSquareText, SquareArrowOutUpRight } from "lucide-react"

import { useEffect, useState } from "react"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';
import { 
  getGms, 
  publicMint, 
  getOwners, 
  getStreak, 
  getSupply, 
  setMood, 
  getMood, 
  getTransactionHashes 
} from "./services/Web3Services"

export function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {data: walletClient } = useWalletClient();
  const { address } = useAccount()
  const { toast } = useToast()

  const [selectedInput, setSelectedInput] = useState(null)
  const [moodInput, setMoodInput] = useState("")
  const [moodValue, setMoodValue] = useState("")
  const [moodLoader, setMoodLoader] = useState(false)
  const [loading, setLoading ] = useState(false)
  const [hashList, setHashList] = useState([])
  const [gms, setGms] = useState([]);
  const [streak, setStreak] = useState(0)
  const [owners, setOwners] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [todayMints, setTodayMints] = useState(0)

  const moodList = ["Based", "Chiller", "GMer", "Bullish", "Explorer", "Optimistic", "Hodler", "Builder", "Collector", "Whale", "Pioneer"]
  const networks = ["base"]
  const networkIcon = {"base": BaseLogo}

  async function getTotalUsers() {
    const _owners = await getOwners()
    setOwners(_owners.length)
  }
  
  async function getTotalSupply() {
    try {
      const supply = await getSupply()
      setTotalSupply(Number(supply.nfts.length))
    } catch (err) {
      console.error(`getTotalSupply returned an error: ${err.message}`)
    }
  }

  async function getUserEvents() {
    const hashes = await getTransactionHashes(walletClient, address)
    setHashList(hashes)
  }

  function handleLabelClick(id) {
    setSelectedInput(id)
  }

  function handleMoodClick(id) {
    setMoodInput(id)
  }

  function handleMoodInput(event) {
    setMoodInput(event.target.value)
  }

  function captalizeString(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function getFormattedDate(_date) {
    const date = new Date(_date * 1000).toISOString().split('T')[0]
    return date
  }

  async function handleStreak() {
    const newStreak = await getStreak(walletClient, address)
    setStreak(newStreak)
  }

  async function handleMintGm() {
    setLoading(true)
    try {  
        const response = await publicMint(walletClient, address)
        const timestamp = response.events.Mint.returnValues.timestamp
        const transactionHash = response.transactionHash
        if (transactionHash) {
          toast({
            title: "Mint Successful.",
            description: "Your streak increased by +1 day.",
            className: "bg-green-200"
          })
        }
        setStreak(streak + 1)
        setHashList([{hash: transactionHash}, ...hashList])
        setGms([timestamp, ...gms])
    } catch (err) {
      console.log(`Error while minting: ${err}`)
    }
    setLoading(false)

  }

  async function getMintsForToday() {
    const transfers = await getSupply()
    let todayMints = 0

    if (!transfers || !transfers.nfts) {
      console.error('No valid transfers data');
      return;
    }

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayStartTimestamp = todayStart.getTime();

    for (let transfer of transfers.nfts) {
      if (transfer.mint && transfer.mint.timestamp) {
        const mintTimestamp = Date.parse(transfer.mint.timestamp); 
        if (mintTimestamp >= todayStartTimestamp) {
          todayMints += 1;
        }
      }
    }
    setTodayMints(todayMints)
  }

  useEffect(() => {

    async function showGms() {
      if (walletClient && address) {
        try {
          const gms = await getGms(walletClient, address);
          setGms(gms.reverse().slice(0, 30));
        } catch (err) {
          console.error(`Error while searching gms: ${err.message}`);
        }
      } else {
        return "Wallet not found or not connected!"
      }
    }

    async function getUserMood() {
      const mood = await getMood(walletClient, address)
      if (mood) {
        setMoodValue(mood)
      }
    }

    async function getContractData() {
      getTotalUsers()
      getTotalSupply()
      getMintsForToday()
    }

    const intervalId = setInterval(getContractData, 10000);

    if (walletClient && address) {
      getTotalUsers()
      getTotalSupply()
      getMintsForToday()
      getUserEvents()
      handleStreak()
      showGms()
      getUserMood()
    } else {
      getTotalUsers()
      getTotalSupply()
      getMintsForToday()
    }

    return () => clearInterval(intervalId);
    
  }, [walletClient, address])

  async function setUserMood(_mood) {
    if (walletClient && address) {
      setMoodLoader(true)
      try {
        const mood = await setMood(walletClient, address, _mood)
        if (mood) {
          setMoodValue(mood)
        }
      } catch (error) {
        console.error("setUserMood returned an error:", error.message)
      }
      setMoodLoader(false)
    } else {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Connect your wallet before interacting.",
      })
    }
  }

  return (
    <div className="w-full h-full p-4 sm:p-10 bg-[#072ac8]">
      <header className="mb-2">
        <Card className="flex items-center justify-between sm: px-6 py-4 step-1">
          <div>
            <a href="https://x.com/dailygm_xyz" target="_blank">
              <img src={XLogo} alt="X Logo" className="w-8 h-8"/>
            </a>
          </div>
          <div className="flex gap-6 items-center">
          <Button onClick={onOpen} className="hidden sm:block text-base button-85" variant="ghost">
            What&apos;s Next?
          </Button>
            <img src={DailyGmLogo} alt="DailyGM Logo" className="w-16 sm:w-20" />
            <ConnectButton label="Connect Wallet" />
          </div>
        </Card>
      </header>
      <main>
        <Card className="p-5 h-full flex flex-col lg:flex-row gap-4">
          <div className="h-full step-2">
            <Card className="">
              <CardHeader>
                <CardTitle>Network Selection</CardTitle>
                <CardDescription>Make sure your wallet is connected to the selected network.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className={`flex w-fit gap-2 ${networks.length > 1 ? "max-[450px]:grid max-[450px]:grid-cols-3" : ""}
                `}>
                  { networks.map((network) => (
                    <div key={network} className="flex items-center justify-start space-x-2">
                      <Label 
                        htmlFor={network}
                        onClick={() => handleLabelClick(network)}  
                        className={`flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 ease-in-out bg-[#f4f4f5] w-[85px] h-8 rounded-md  ${selectedInput === `${network}` ? "bg-yellow-400" : "hover:bg-yellow-400"}`} >
                        <img src={networkIcon[network]} alt={`${network} Network Logo`} className="w-5 rounded-full" />
                        <span className={networks.length > 1 ? "hidden min-[420px]:block" : "block" }>{captalizeString(network)}</span>
                      </Label>
                      <Input type="radio" id={network} name="network_selection" className="hidden" />
                    </div>
                  ))}
                </form>
              </CardContent>
            </Card>
            <Card className="h-full mt-4 overflow-hidden">
              <CardHeader className="flex flex-row justify-between space-y-0">
                <Card className="shadow-none border-none space-y-1.5">
                  <CardTitle>Streak</CardTitle>
                  <CardDescription>Your activity history</CardDescription>
                </Card>
                <Card className="flex w-10 h-9 items-center justify-center">
                  <CardTitle>{streak}</CardTitle>
                </Card>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 lg:overflow-auto">
                  {gms.length ? gms.map((date, index) => (
                    <a key={date} href={`https://basescan.org/tx/${hashList[index]?.hash}`} target="_blank">
                      <Card className="flex items-center cursor-pointer justify-between px-4 py-1 m-1 hover:bg-zinc-100">
                        <h2 className="text-base font-semibold text-gray-500">{getFormattedDate(Number(date))}</h2>
                        <img src={CheckIcon} alt="Check icon" className="w-5" />
                      </Card>
                    </a>
                  )) 
                  : 
                  <div className="flex flex-col items-center justify-center h-44">
                    <img src={EthIcon} alt="" className="w-10" />
                    <h3 className="text-zinc-500">Are you onchain?</h3>
                  </div>}
                </ScrollArea>
              </CardContent>
            </Card>
            <Button 
                type="button" 
                onClick={ address 
                  ? (!Number(gms[0]) || Number(gms[0]) < Math.floor(new Date().setUTCHours(0, 0, 0, 0) / 1000)) 
                    ? handleMintGm 
                    : () => {
                      toast({
                        title: "You have already GM'd today.",
                        description: "Come back tomorrow to increase your streak!",
                        className: "bg-blue-100 text-black border-none"
                      });
                    }
                  : () => {
                    toast({
                      variant: "destructive",
                      title: "Uh oh! Something went wrong.",
                      description: "Connect your wallet before GMing.",
                    });
                  }
                } 
                className="flex gap-2 mt-4 w-full h-fit bg-[#ff9100] hover:bg-[#ff8500] text-lg rounded-xl disabled:opacity-100 disabled:cursor-not-allowed"
              >
                <img src={SunIcon} alt="White sun icon" className={loading ? "animate-spin-slow w-5" : "w-5"} />
                GM
            </Button>
          </div>
          <div className="w-full h-full">
            <div className="flex flex-col sm:flex-row h-full gap-4 mb-4">
              <Card className="flex flex-col justify-between w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
                  <Users className=" w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  <div className="text-base sm:text-2xl font-bold">{owners}</div>
                </CardContent>
              </Card>
              <Card className="flex flex-col justify-between w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total GMs</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent className="">
                  <div className="text-base sm:text-2xl font-bold">{totalSupply}</div>
                </CardContent>
              </Card>
              <Card className="flex flex-col justify-between w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium flex gap-1 items-center">
                    GMs Today
                    <HoverCard>
                      <HoverCardTrigger className="cursor-pointer">
                        <CircleHelp className="text-zinc-500 w-4 h-4" />
                      </HoverCardTrigger>
                      <HoverCardContent className="text-xs">
                        GMs Today may take up to 5 minutes to update.
                      </HoverCardContent>
                    </HoverCard>
                  </CardTitle>
                  <Sun className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  <div className="text-base sm:text-2xl font-bold">{todayMints}</div>
                </CardContent>
              </Card>
            </div>
            <div className="h-full">
              <Card className="flex flex-col h-full overflow-hidden">
                <CardHeader className="flex flex-row justify-between space-y-0">
                  <Card className="shadow-none border-none space-y-1.5">
                    <CardTitle>Onchain Mood</CardTitle>
                    <CardDescription>How are you feeling today? Let&apos;s get it onchain!</CardDescription>
                  </Card>
                  <Card className="hidden sm:flex w-32 h-9 items-center justify-center">
                    <CardTitle className="text-sm">{moodValue ? moodValue : "Based"}</CardTitle>
                  </Card>
                </CardHeader>
                <CardContent className="h-full sm:h-[333px] flex flex-col gap-5 items-center">
                  <div className="flex flex-col items-center justify-center gap-4 mx-auto pt-2 sm:pt-10 pb-5">
                    <Card className="flex sm:hidden w-32 h-9 items-center justify-center">
                      <CardTitle className="text-sm">{moodValue ? moodValue : "Based"}</CardTitle>
                    </Card>
                    <div className="flex gap-4">
                      <Input type="text" placeholder="Based" className="outline-none" value={moodInput} onChange={handleMoodInput}/>
                      <Tooltip content="0.0001 ETH is required">
                        <Button className="bg-blue-700 hover:bg-blue-600" onClick={() => setUserMood(moodInput)}>
                          {moodLoader ?
                              <LoaderCircle className="w-4 mr-2 animate-spin" />
                          : ""
                          }
                          Mood
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 max-w-[600px]">
                    { moodList.map((mood) => (
                      <div key={mood} className="flex items-center justify-start space-x-2">
                        <Label
                          htmlFor={mood}
                          onClick={() => handleMoodClick(mood)}
                          className={`flex flex-row items-center justify-center gap-2 cursor-pointer transition-colors duration-100 ease-in-out bg-[#f4f4f5] w-[85px] h-8 rounded-md  ${moodInput === `${mood}` ? "bg-yellow-400" : "hover:bg-yellow-400"}`} >
                          <span>{captalizeString(mood)}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="w-full mt-auto flex items-center justify-end">
                    <Popover>
                      <PopoverTrigger>
                        <MessageSquareText className="text-zinc-500 w-7 h-7"/>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 mr-11 flex flex-col gap-3">
                        <div className="space-y-2">
                          <a href="https://forms.gle/EQ6Uqt65iiu6HoGK8" target="_blank" className="flex gap-2 items-center">
                            <h4 className="font-medium leading-none">Feedback</h4>
                            <SquareArrowOutUpRight className="w-4 h-4" />
                          </a>
                        </div>
                        <div className="space-y-2">
                          <a href="https://forms.gle/1VWGwMX3Pz3FCSeq6" target="_blank" className="flex gap-2 items-center">
                            <h4 className="font-medium leading-none">Contact</h4>
                            <SquareArrowOutUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
        <Modal size={'2xl'} isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">GM Culture Is Getting Onchain!</ModalHeader>
                <ModalBody>
                  <p>Hello fellows!</p>
                  <p> 
                    DailyGM is growing, and our next steps aim to take the GM culture to the next level! We are seeking strategic partnerships to expand our presence and deliver even more value to our users. Additionally, we will focus on increasing our user base, bringing new features, and fostering a vibrant and active community.
                  </p>
                  <p>
                    We are also looking for developers, designers, and other enthusiasts who want to contribute to the project. Although we don&apos;t have financial resources available yet, we believe in DailyGM&apos;s potential and hope to build something amazing together. If you&apos;re excited to be part of this journey, 
                    <a href="https://forms.gle/1VWGwMX3Pz3FCSeq6" target="_blank"><strong> join us</strong></a> and help shape the future of DailyGM!
                  </p>
                  <p>
                    Stay tuned — DailyGM is just getting started!
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </main>
    </div>
  )
}
