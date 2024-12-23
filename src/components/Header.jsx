import React from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Container, Typography, Toolbar, Select, MenuItem,Avatar } from "@mui/material";
import { CryptoState } from '../CryptoContext';
const Header = () => {
  const navigate = useNavigate();
  const { currency, setCurrency } = CryptoState();
  console.log(currency);
  return (
    <AppBar position='static'>
      <Container>
        <Toolbar>
          <Avatar src="Images/crypto.jpg" alt="Crypto Logo" sx={{ marginRight: 1 }} />
          <Typography onClick={() => navigate("/")} style={{
            fontFamily: "Times new roman",
            color: "inherit",
            fontWeight: "bolder",
            flex: 1,
            cursor: "pointer",
          }}
            variant='h5'>
            CryptoWave
          </Typography>
          <Select variant='outlined' style={{
            width: 100,
            height: 40,
            marginLeft: 15,
            color: "white",
          }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}>
            <MenuItem value={'USD'}>USD</MenuItem>
            <MenuItem value={'INR'}>INR</MenuItem>
          </Select>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header;