import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EngineeringIcon from "@mui/icons-material/Engineering";
import {
  Box, Button, TextField, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Card, CardContent, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress
} from "@mui/material";
import { getCookie } from "../pages/helpers";

export const AddWorker = () => {
  const [username, setUsername] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const API = process.env.REACT_APP_API;
  const token = getCookie('token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchWorkers = useCallback(() => {
    setLoading(true);
    axios.get(`${API}/workers`, { headers })
      .then(res => {
        setWorkers(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error fetching workers");
        setLoading(false);
      });
  }, [API, headers]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const addUser = () => {
    if (!username.trim() || !idNumber.trim()) {
      toast.error("Please provide both name and ID number");
      return;
    }
    if (!/^[0-9]{9}$/.test(idNumber)) {
      toast.error("ID number must be exactly 9 digits");
      return;
    }

    setAdding(true);
    axios.post(`${API}/addworker`, { username: username.trim(), idNumber: idNumber.trim() }, { headers })
      .then(() => {
        toast.success("Worker added successfully");
        setUsername("");
        setIdNumber("");
        fetchWorkers();
      })
      .catch(error => {
        toast.error(error.response?.data?.message || "Error adding worker");
      })
      .finally(() => setAdding(false));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    axios.delete(`${API}/workers/${deleteTarget.idNumber}`, { headers })
      .then(() => {
        toast.success("Worker deleted");
        setDeleteTarget(null);
        fetchWorkers();
      })
      .catch(() => {
        toast.error("Error deleting worker");
      })
      .finally(() => setDeleting(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addUser();
  };

  return (
    <Box>
      {/* Add Worker Form */}
      <Card variant="outlined" sx={{ mb: 3, borderLeft: '4px solid #4A7B59' }}>
        <CardContent>
          <Typography variant="h6" color="#4A7B59" gutterBottom>
            Add New Worker
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Worker Name"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                size="small"
                variant="outlined"
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="ID Number (9 digits)"
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                size="small"
                variant="outlined"
                color="success"
                inputProps={{ maxLength: 9 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                onClick={addUser}
                variant="contained"
                color="success"
                startIcon={adding ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
                disabled={adding}
                fullWidth
                sx={{ height: 40 }}
              >
                {adding ? 'Adding...' : 'Add Worker'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Workers Table */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <EngineeringIcon sx={{ color: '#4A7B59' }} />
          <Typography variant="h6" color="#4A7B59">
            Workers
          </Typography>
          <Chip label={workers.length} size="small" color="success" variant="outlined" />
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress color="success" />
        </Box>
      ) : workers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <EngineeringIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 1 }} />
            <Typography color="text.secondary">
              No workers registered yet. Add your first worker above.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>ID Number</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers.map((worker, index) => (
                <TableRow key={worker.idNumber || index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{worker.username}</TableCell>
                  <TableCell>{worker.idNumber}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => setDeleteTarget(worker)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Worker</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.username}</strong> (ID: {deleteTarget?.idNumber})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
