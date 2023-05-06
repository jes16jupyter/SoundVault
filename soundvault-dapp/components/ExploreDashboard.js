import { useState , useEffect} from 'react';
import { useAccount,useParticleProvider} from "@particle-network/connect-react-ui";
import getMusicVault from "@/libs/musicVault";
import { ethers } from 'ethers';
import StatisticCard from './ui/StatisticCard/StatisticCard';
import LeaderBoard from './ui/LeaderBoard/LeaderBoard';
import MusicAcheteCards from './ui/musicAcheteCards/MusicAcheteCards';

export default function ExploreDashboard(){

    // const account = useAccount();  // get User Info in the hook
    // let provider = undefined;
    // let signer = undefined;
    // let musicVault = undefined;
    // if (account != undefined && account != ""){
    //     const web3provider = useParticleProvider();
    //     provider = new ethers.providers.Web3Provider(web3provider);
    //     musicVault = getMusicVault(provider);
    //     signer = provider.getSigner();
    // }

    // useEffect(() => {
    //     async function fetchDataAsync() {
    //         if (provider != undefined) {
    //             await fetchData();
    //         }
    //     }
    //     fetchDataAsync();
    // }, [account]);

    let account;
    let provider;
    let musicVault;
    let signer;

    const [musicList,setMusicList] = useState([])
    const [purchaseLeaderBoardList,setPurchaseLeaderBoardList] = useState([])
    const [voteLeaderBoardList,setVoteLeaderBoardList] = useState([])


    useEffect(() => {
        async function fetchDataAsync() {
            console.log("ether ",window.ethereum);
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            signer = provider.getSigner();
            account = await signer.getAddress();
            musicVault = getMusicVault(provider);
            await fetchData();
            }
        fetchDataAsync();
    }, []);

    const fetchData = async function() {
        console.log("fetching data for user profile")
        const purchaseLeaderBoard = await musicVault.getPurchaseLeaderboard();
        console.log(purchaseLeaderBoard)
        setPurchaseLeaderBoardList(await Promise.all(purchaseLeaderBoard.map(getMusicById)));
        const voteLeaderBoard = await musicVault.getVoteLeaderboard();
        console.log(voteLeaderBoard)
        setVoteLeaderBoardList(await Promise.all(voteLeaderBoard.map(getMusicById)));
        const musicList = Array.from({ length: (await musicVault.getMusicNumber()).toNumber() }, (_, index) => index);
        setMusicList(await Promise.all(musicList.map(getMusicById)));
    }

    const getMusicById = async (val) => {
        let id;
        if ((typeof val)!='number'){
            id = val.toNumber();
        }else{
            id = val;
        }
        let musicInfo = await musicVault.musicId2MusicMapping(id);
        let musicSellInfo = await musicVault.musicId2MusicSellInfoMapping(id);
        return ({...musicInfo, ...musicSellInfo});
    }

    return (
        <section className="bg-black">
            <div className="w-full mx-auto py-8 sm:py-8 px-4 sm:px-6 lg:px-8">   
                <div className="sm:flex sm:flex-col sm:align-center">

                    <div className="flex bg-black text-white space-x-4 xl:grid-cols-4">
                        <div className="flex-grow-0 flex-shrink-0 w-1/4 border border-dashed border-white"> 
                            <LeaderBoard name="Purchase" list={purchaseLeaderBoardList} className="h-1/2"/>
                            <LeaderBoard name="Vote" list={voteLeaderBoardList} className="h-1/2"/>
                        </div>
                        <div className="flex-grow flex-shrink w-3/4 border border-dashed border-white">
                            <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
                                Exploring the world of melody..   
                            </p>
                            
                            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2 overflow-y-auto">
                                {
                                    musicList.map((music) => {
                                        return(
                                            <MusicAcheteCards music={music} cbs={1} />
                                        )
                                    })
                                } 

                            </div>
                        </div>
                    </div>                    
                </div>
            </div>    
        </section>
    )

}