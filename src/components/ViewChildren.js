import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ViewChildren = () => {
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
        toast.error('Error fetching children');
      });
  }, []);

  // Eliminar un niño por su ID
  const deleteChild = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API}/deletechild/${id}`)
      .then(() => {
        setChildren(children.filter(child => child._id !== id));
        toast.success('Child deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting child:', error);
        toast.error('Error deleting child');
      });
  };

  return (
    <Box display="flex" flexDirection="column" padding={3}>
      <Typography color='success' variant="h2" textAlign="center" gutterBottom>
        View Children
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Child's Name</TableCell>
              <TableCell>Teudat Zeut</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Bank</TableCell>
              <TableCell>Bank Account</TableCell>
              <TableCell>Actions</TableCell>
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
                    Delete
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
