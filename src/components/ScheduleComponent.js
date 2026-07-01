import React from "react";
import { Box, Typography } from "@mui/material";
import logo from '../assets/logo.svg'

const ScheduleComponent = () => {
  const winterSchedule = "08:00 - 11:30";

  const summerSchedule = {
    sundayToThursday: "07:30 - 16:00",
    friday: "08:00 - 12:00",
  };

  const renderSchedule = (day, schedule) => (
    <Box sx={{ padding: 2, border: '1px solid', borderColor: 'grey.400', borderRadius: 2, textAlign: 'center' }}>
      <Typography variant="h6" align="center" gutterBottom>
        {day}
      </Typography>
      <Box
        sx={{
          padding: 2,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 1,
          backgroundColor: 'success.main',
          color: 'common.white',
        }}
      >
        <Typography variant="body1">{schedule}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ padding: 4 }}>
      {/* <Typography color='#4A7B59' variant="h4" align="center" gutterBottom>
        Weekly Schedule
      </Typography> */}
      <Box
        position="relative"
        // textAlign="center"
        padding={1}
        // display="flex"
        // justifyContent="center"
        // alignItems="center"
      >
        {/* Texto encima */}
        <Typography
          variant="h4"
          sx={{ position: "relative", zIndex: 2 }}
          align="center" gutterBottom
        >
          Weekly Schedule
        </Typography>

        {/* Imagen detrás */}
        <Box
          component="img"
          src={logo}
          alt="login icon"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 250,
            opacity: 0.2, // hace que se vea como fondo
            zIndex: 1,
          }}
        />
      </Box>
      
      <Box sx={{ marginY: 4 }}>
        <Typography variant="h5" gutterBottom>
          Summer Schedule
        </Typography>
        {renderSchedule("Sunday to Thursday", summerSchedule.sundayToThursday)}
        <Box sx={{ marginTop: 4 }}>
          {renderSchedule("Friday", summerSchedule.friday)}
        </Box>
      </Box>
      <Box sx={{ marginY: 4 }}>
        <Typography variant="h5" gutterBottom>
          Winter Schedule
        </Typography>
        {renderSchedule("Friday", winterSchedule)}
      </Box>
    </Box>
  );
};

export default ScheduleComponent;
