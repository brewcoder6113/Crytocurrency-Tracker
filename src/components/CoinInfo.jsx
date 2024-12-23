import React, { useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext';
import { HistoricalChart } from '../config/api';
import "./styles/coinInfo.css";
import {Line} from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { CircularProgress,Container,Typography} from '@mui/material';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';
const CoinInfo = ({coin}) => {
  const [historicalData,setHistoricalData]=useState();
  const [days,setDays]=useState(90);
  const {currency}=CryptoState();

  const fetchHistoricData = async () => {
    try 
    {
    const data=await fetch(HistoricalChart(coin.id,days,currency))
    const mainData=await data.json();
    setHistoricalData(mainData.prices);
    } 
    catch (error) {
      console.error('Error fetching trending coins:', error);
    }
  };
  useEffect(()=>{
    console.log("use effect is running");
    fetchHistoricData();
  },[currency,days]);
  
  return (
      <div className='container-info'>
        {!historicalData?(
            <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              flexDirection: "column",
            }}
          >
            <CircularProgress color="inherit" />
            <Typography variant="h5">Loading...</Typography>
          </Container>)
            :(<>
            <Line
            data={{
              labels:historicalData.map((coin)=>{
              let date=new Date(coin[0]);
              let time=date.getHours()>12?
              `${date.getHours()-12}:${date.getMinutes()} PM`
               :`${date.getHours()}:${date.getMinutes()} AM`;

               return days===1?time:date.toLocaleDateString()
              }),
              datasets: [
                {data:historicalData.map((coin)=>coin[1]),
                label:`price (Past ${days} Days) in ${currency}`,
                borderColor:"grey"
                }
              ]
            }}
            options={{
              scales: {
                x: {
                  type: 'category',
                },
                y: {
                  beginAtZero: true,
                },
              },
              elements:{
                point:{
                  radius:1
                }
              }
            }}
            />
            <div className='buttons'>
              {chartDays.map(day=>(
                <SelectButton
                key={day.value}
                onClick={()=>setDays(day.value)}
                >{day.label}</SelectButton>
              ))}
            </div>
            </>)
        }
      </div>
  )
}

export default CoinInfo;