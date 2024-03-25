import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import RoomJoinPageCSS from "../../static/css/RoomJoinPage.module.css";

export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      error: "",
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this);
  }

  render() {
    return (
      <div className={RoomJoinPageCSS.container}>
        <p className={RoomJoinPageCSS.gradientText}>SyncVibe</p>
        <video autoPlay muted loop className={RoomJoinPageCSS.backgroundVideo}>
          <source src="../../static/images/videoBG.mp4" type="video/mp4" />
        </video>
        <div className={RoomJoinPageCSS.container}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} align="center">
              <div>
                <Typography variant="h2" component="h2">
                  <p className={RoomJoinPageCSS.main}>Join a Room</p>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} align="center">
              <TextField
                error={this.state.error}
                label="Code"
                placeholder="Enter a Room Code"
                value={this.state.roomCode}
                helperText={this.state.error}
                variant="outlined"
                onChange={this.handleTextFieldChange}
              />
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                className={RoomJoinPageCSS.btn}
                variant="contained"
                color="primary"
                onClick={this.roomButtonPressed}>
                Enter Room
              </Button>
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                className={RoomJoinPageCSS.btn}
                variant="contained"
                color="secondary"
                to="/"
                component={Link}>
                Back
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  handleTextFieldChange(e) {
    this.setState({
      roomCode: e.target.value,
    });
  }

  roomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.state.roomCode,
      }),
    };
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          this.props.history.push(`/room/${this.state.roomCode}`);
        } else {
          this.setState({ error: "Room not found." });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
