import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

export const AddWorker = () => {
  const [username, setUsername] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [workers, setWorkers] = useState([]);
  const [message, setMessage] = useState("");

  // Function to add a new worker
  const addUser = () => {
    if (!username || !idNumber) {
      setMessage("Please provide both username and ID number");
      return;
    }

    if (!/^[0-9]{9}$/.test(idNumber)) {
      setMessage("ID number must be 9 digits long");
      toast.error("ID number must be 9 digits long");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API}/addworker`, { username, idNumber })
      .then(() => {
        setMessage("User added successfully");
        setUsername("");
        setIdNumber("");
        toast.success("User added successfully");
        fetchWorkers(); // Refresh the workers list
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setMessage(
          "Error adding user: " +
            (error.response?.data?.message || "Unknown error")
        );
        toast.error(
          "Error adding user: " +
            (error.response?.data?.message || "Unknown error")
        );
      });
  };

  // Function to fetch all workers
  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/workers`);
      setWorkers(response.data);
      toast.success("Workers fetched successfully!");
    } catch (error) {
      // console.error("Error fetching workers:", error);
      toast.error("Error fetching workers.");
    }
  };

  // Function to delete a worker
  const deleteWorker = async (idNumber) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/workers/${idNumber}`);
      toast.success("Worker deleted successfully!");
      fetchWorkers(); // Refresh the workers list
    } catch (error) {
      // console.error("Error deleting worker:", error);
      toast.error("Error deleting worker.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      padding={3}
    >
      <Typography variant="h2" padding={3} textAlign={"center"}>
        New Worker
      </Typography>
      <TextField
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        type="text"
        variant="outlined"
        placeholder="Username"
        sx={{ width: "300px" }}
      />
      <TextField
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        margin="normal"
        type="text"
        variant="outlined"
        placeholder="ID Number (9 digits)"
        sx={{ width: "300px" }}
      />
      <Button
        onClick={addUser}
        endIcon={<PersonAddIcon />}
        sx={{ marginTop: 3, borderRadius: 3 }}
        variant="contained"
        color="success"
      >
        Add User
      </Button>
      <Button
        onClick={fetchWorkers}
        endIcon={<VisibilityIcon />}
        sx={{ marginTop: 2, borderRadius: 3 }}
        variant="outlined"
        color="success"
      >
        Show All Workers
      </Button>

      {/* Display workers in a table */}
      {workers.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: 4, width: "80%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Username</strong></TableCell>
                <TableCell><strong>ID Number</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers.map((worker, index) => (
                <TableRow key={index}>
                  <TableCell>{worker.username}</TableCell>
                  <TableCell>{worker.idNumber}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => deleteWorker(worker.idNumber)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ToastContainer />
    </Box>
  );
};
