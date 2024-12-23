import React, { useEffect, useState } from 'react';
import './styles/carousel.css';
import { CryptoState } from '../CryptoContext';
import { TrendingCoins } from '../config/api';
import AliceCarousel from "react-alice-carousel";
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const Carousel = () => {
  const { currency, symbol } = CryptoState();
  const [trending, setTrending] = useState([]);
  const fetchTrendingCoins = async () => {
    try {
      const cachedData = localStorage.getItem('cachedTrendingData');
      if (cachedData) {
        setTrending(JSON.parse(cachedData));
        console.log("using local storage data for carousal")
      }
      else {
        console.log("fetching carousal data")
        const data = await fetch(TrendingCoins(currency));
        const maindata = await data.json();
        setTrending(maindata);
        localStorage.setItem('cachedTrendingData', JSON.stringify(maindata));
      }
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    }
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);
  const res = {
    0: {
      items: 2
    },
    512: {
      items: 4
    }
  };
  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;
    return (
      <Link className='carousel-item' to={`/coins/${coin.id}`}>
        <img src={coin?.image} alt={coin?.name} height="80px" style={{
          marginBottom: 10
        }}
        />
        <span>{coin?.symbol}</span>
        &nbsp;
        <span style={{
          color: profit > 0 ? "rgb(14,203,129)" : "red",
          fontWeight: 500
        }}>
          {profit && '+'}{coin?.price_change_percentage_24h?.toFixed(2)}%
        </span>
        <span style={{
          fontSize: 22,
          fontWeight: 500
        }}>{symbol}{numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    )
  })
  return (
    <div className='carousel-main'>
      <AliceCarousel
        mouseTracking={true}
        infinite={true}
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={res}
        items={items}
        autoPlay
      >
      </AliceCarousel>
    </div>
  )
}

export default Carousel