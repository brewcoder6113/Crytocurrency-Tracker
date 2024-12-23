import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { SingleCoin } from "../config/api";
import "./coinPage.css";
import CoinInfo from '../components/CoinInfo';
import { LinearProgress, Typography } from "@material-ui/core";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol } = CryptoState();
  const fetchCoin = async () => {
    try{
    const data = await fetch(SingleCoin(id))
    const mainData = await data.json();
    setCoin(mainData);
    }
    catch(err)
    { 
     console.log(err)
    }
  }
  useEffect(() => {
    console.log("fetched coin data")
    fetchCoin();
  }, [])
  console.log(coin)
  if (!coin)
    return <LinearProgress style={{ backgroundColor: "black" }} />
  return (
    <div className='container' style={{ display: "flex" }}>
      <div className='sidebar'>
        <img src={coin?.image.large} alt={coin?.name} height="200" style={{ marginBottom: 20 }} />
        <Typography variant='h3'
          style={{
            fontWeight: "bolder",
            marginBottom: 20,
            fontFamily: "Times new roman"
          }}
        >{coin?.name}</Typography>
        <Typography variant='body1'>
          <h3 style={{ fontSize: '18px', fontFamily: 'Times new roman', margin: 20 }}
            dangerouslySetInnerHTML={{ __html: coin?.description.en.split(". ")[0] }}></h3>
        </Typography>
        <div className='marketData' style={{ textAlign: 'left' }}>
          <Typography variant='h5' style={{ fontFamily: 'Times new roman' }}>
            Rank: {coin?.market_cap_rank}
          </Typography>
          <Typography variant='h5' style={{ fontFamily: 'Times new roman' }}>
            Current Price: {symbol}{numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}
          </Typography>
          <Typography variant='h5' style={{ fontFamily: 'Times new roman' }}>
            Market Capital: {symbol}{numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6))}M
          </Typography>
        </div>
      </div>
      <CoinInfo coin={coin} />
    </div>
  )
}

export default CoinPage
