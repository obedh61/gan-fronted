import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

export const ViewChildren = () => {
  const { t } = useTranslation()
  const [children, setChildren] = useState([]);
  const [message, setMessage] = useState('');

  // Obtener todos los niños desde la base de datos
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/getchildren`)
      .then((response) => {
        setChildren(response.data);
      })
      .catch((error) => {
        console.error('Error fetching children:', error);
        toast.error(t('legacy.viewChildren.fetchError'));
      });
  }, [t]);

  // Eliminar un niño por su ID
  const deleteChild = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API}/deletechild/${id}`)
      .then(() => {
        setChildren(children.filter(child => child._id !== id));
        toast.success(t('legacy.viewChildren.deleteSuccess'));
      })
      .catch((error) => {
        console.error('Error deleting child:', error);
        toast.error(t('legacy.viewChildren.deleteError'));
      });
  };

  return (
    <Box display="flex" flexDirection="column" padding={3}>
      <Typography color='success' variant="h2" textAlign="center" gutterBottom>
        {t('legacy.viewChildren.title')}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('legacy.viewChildren.firstName')}</TableCell>
              <TableCell>{t('legacy.viewChildren.lastName')}</TableCell>
              <TableCell>{t('legacy.viewChildren.childName')}</TableCell>
              <TableCell>{t('legacy.viewChildren.teudatZeut')}</TableCell>
              <TableCell>{t('legacy.viewChildren.phoneNumber')}</TableCell>
              <TableCell>{t('legacy.viewChildren.bank')}</TableCell>
              <TableCell>{t('legacy.viewChildren.bankAccount')}</TableCell>
              <TableCell>{t('legacy.viewChildren.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((child) => (
              <TableRow key={child._id}>
                <TableCell>{child.firstName}</TableCell>
                <TableCell>{child.lastName}</TableCell>
                <TableCell>{child.childName}</TableCell>
                <TableCell>{child.teudatZeut}</TableCell>
                <TableCell>{child.phoneNumber}</TableCell>
                <TableCell>{child.bank}</TableCell>
                <TableCell>{child.bankAccount}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => deleteChild(child._id)}
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                  >
                    {t('legacy.viewChildren.delete')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer />
    </Box>
  );
};
