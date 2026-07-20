import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AppToastContainer from './AppToastContainer';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Button, TextField, Typography } from '@mui/material';

export const AddNewChild = () => {
  const { t } = useTranslation()
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
      setMessage(t('legacy.addNewChild.allFieldsRequired'));
      toast.error(t('legacy.addNewChild.allFieldsRequired'));
      return;
    }

    if (!/^[0-9]{9}$/.test(teudatZeut)) {
      setMessage(t('legacy.addNewChild.teudatZeutDigits'));
      toast.error(t('legacy.addNewChild.teudatZeutDigits'));
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
        setMessage(t('legacy.addNewChild.addSuccess'));
        setFirstName('');
        setLastName('');
        setChildName('');
        setTeudatZeut('');
        setPhoneNumber('');
        setBank('');
        setBankAccount('');
        toast.success(t('legacy.addNewChild.addSuccess'));
      })
      .catch((error) => {
        // console.error('Error adding child:', error);
        setMessage(t('legacy.addNewChild.addError', { message: error.response?.data?.message || t('common.error') }));
        toast.error(t('legacy.addNewChild.addError', { message: error.response?.data?.message || t('common.error') }));
      });
  };

  return (
    <Box display="flex" flexDirection={"column"}>
      <Typography variant='h2' padding={3} textAlign={"center"}>
        {t('legacy.addNewChild.title')}
      </Typography>
      <TextField
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder={t('legacy.addNewChild.firstName')}
      />
      <TextField
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder={t('legacy.addNewChild.lastName')}
      />
      <TextField
        value={childName}
        onChange={(e) => setChildName(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder={t('legacy.addNewChild.childName')}
      />
      <TextField
        value={teudatZeut}
        onChange={(e) => setTeudatZeut(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder={t('legacy.addNewChild.teudatZeut')}
      />
      <TextField
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder={t('legacy.addNewChild.phoneNumber')}
      />
      <TextField
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder={t('legacy.addNewChild.bank')}
      />
      <TextField
        value={bankAccount}
        onChange={(e) => setBankAccount(e.target.value)}
        margin='normal'
        type='text'
        variant='outlined'
        placeholder={t('legacy.addNewChild.bankAccount')}
      />
      <Button
        onClick={addChild}
        endIcon={<PersonAddIcon />}
        sx={{ marginTop: 3, borderRadius: 3 }}
        variant='contained'
        color='success'
      >
        {t('legacy.addNewChild.addChild')}
      </Button>
      <AppToastContainer />
    </Box>
  );
};
