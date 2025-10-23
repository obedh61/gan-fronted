import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Button, TextField, Typography } from '@mui/material';

export const AddNewChild = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [childName, setChildName] = useState('');
  const [teudatZeut, setTeudatZeut] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bank, setBank] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [message, setMessage] = useState('');

  const addChild = () => {
    // Validation
    if (!firstName || !lastName || !childName || !teudatZeut || !phoneNumber || !bank || !bankAccount) {
      setMessage('Please provide all the fields');
      toast.error('Please provide all the fields');
      return;
    }

    if (!/^[0-9]{9}$/.test(teudatZeut)) {
      setMessage('Teudat Zeut must be 9 digits');
      toast.error('Teudat Zeut must be 9 digits');
      return;
    }

    // Prepare data to send to backend
    const childData = {
      firstName,
      lastName,
      childName,
      teudatZeut,
      phoneNumber,
      bank,
      bankAccount
    };

    // API call to add the new child
    axios
      .post(`${process.env.REACT_APP_API}/addchild`, childData)
      .then(() => {
        setMessage('Child added successfully');
        setFirstName('');
        setLastName('');
        setChildName('');
        setTeudatZeut('');
        setPhoneNumber('');
        setBank('');
        setBankAccount('');
        toast.success('Child added successfully');
      })
      .catch((error) => {
        // console.error('Error adding child:', error);
        setMessage('Error adding child: ' + (error.response?.data?.message || 'Unknown error'));
        toast.error('Error adding child: ' + (error.response?.data?.message || 'Unknown error'));
      });
  };

  return (
    <Box display="flex" flexDirection={"column"}>
      <Typography variant='h2' padding={3} textAlign={"center"}>
        Add New Child
      </Typography>
      <TextField
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder='First Name'
      />
      <TextField
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder='Last Name'
      />
      <TextField
        value={childName}
        onChange={(e) => setChildName(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder='Childs Name'
      />
      <TextField
        value={teudatZeut}
        onChange={(e) => setTeudatZeut(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder='Teudat Zeut (9 digits)'
      />
      <TextField
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder='Phone Number'
      />
      <TextField
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder='Bank'
      />
      <TextField
        value={bankAccount}
        onChange={(e) => setBankAccount(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder='Bank Account'
      />
      <Button
        onClick={addChild}
        endIcon={<PersonAddIcon />}
        sx={{ marginTop: 3, borderRadius: 3 }}
        variant='contained'
        color='success'
      >
        Add Child
      </Button>
      <ToastContainer />
    </Box>
  );
};
