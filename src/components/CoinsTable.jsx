import React, { useEffect, useState } from 'react';
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import './styles/coinTable.css';
import { useNavigate } from "react-router-dom";
import { TextField, Container, Typography, TableContainer, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Pagination } from "@material-ui/lab";
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinsTable = () => {
  const navigate = useNavigate()
  const { currency, symbol } = CryptoState();
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchCoins = async () => {
    try {
      const cachedData = localStorage.getItem('cachedCoinsData');
      if (cachedData) {
        setCoins(JSON.parse(cachedData));
        console.log("using local storage data for table")
      }
      else {
        console.log("fetching table data")
        setLoading(true);
        const data = await fetch(CoinList(currency));
        const maindata = await data.json();
        setCoins(maindata);
        localStorage.setItem('cachedCoinsData', JSON.stringify(maindata));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };

  useEffect(() => {
    fetchCoins()
  }, [currency]);
  const handleSearch = () => {
    return coins.filter((coin) => (
      coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
    ))
  }
  return (
    
      <Container>
        <TextField label="Search" variant="outlined"
          style={{
            width: "20%",
            marginBottom: 20,
            marginTop:20,
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>
          {
            loading ? (
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
          </Container>
            ) : (
              <Table aria-label="simple table">
                <TableHead style={{ backgroundColor: "#a5defa" }}>
                  <TableRow>
                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                      <TableCell
                        style={{
                          color: "black",
                          fontWeight: "bolder",
                          fontFamily: "Times new roman",
                          fontSize: "20px"
                        }}
                        key={head}
                        align={head === "Coin" ? "" : "right"}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className='row'
                        key={row.name}
                      >
                        <TableCell component="th"
                          scope='row'
                          style={{
                            display: "flex",
                            gap: 15
                          }}
                        >
                          <img src={row.image} alt={row.name} height="50" style={{ marginBottom: 10 }} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ textTransform: "uppercase", fontSize: 22 }}>
                              {row.symbol}
                            </span>
                            <span>{row.name}</span>
                          </div>
                        </TableCell>
                        <TableCell align='right'>
                          {symbol}{numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell align='right'
                          style={{
                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                            fontWeight: 500
                          }}>
                          {profit && '+'}{row?.price_change_percentage_24h?.toFixed(2)}%
                        </TableCell>
                        <TableCell align='right'>
                          {symbol}{numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                        </TableCell>
                      </TableRow>

                    )
                  })}
                </TableBody>
              </Table>
            )
          }
        </TableContainer>
        <Pagination className='pagination'
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center"
          }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
  )
}

export default CoinsTable