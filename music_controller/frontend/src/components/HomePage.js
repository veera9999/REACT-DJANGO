import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import HomePageCSS from "../../static/css/HomePage.module.css";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }

  renderHomePage() {
    return (
      <div className={HomePageCSS.container}>
        <video autoPlay muted loop className={HomePageCSS.backgroundVideo}>
          <source src="../../static/images/videoBG.mp4" type="video/mp4" />
        </video>
        <div className={HomePageCSS.content}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center">
            <Grid item xs={12} align="center">
              <div className={HomePageCSS.hero}>
                <Typography
                  variant="h1"
                  component="h1"
                  className={HomePageCSS.heading}>
                  <p className={HomePageCSS.gradientText}>SyncVibe</p>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} align="center">
              <ButtonGroup variant="outlined">
                <Button
                  className={HomePageCSS.btn}
                  color="primary"
                  variant="contained"
                  size="large"
                  to="/join"
                  component={Link}>
                  Join a Room
                </Button>
                <Button
                  className={HomePageCSS.btn}
                  color="secondary"
                  variant="contained"
                  size="large"
                  to="/create"
                  component={Link}>
                  Create Room
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  clearRoomCode() {
    this.setState({
      roomCode: null,
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return this.state.roomCode ? (
                <Redirect to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              );
            }}
          />
          <Route path="/join" component={RoomJoinPage} />
          <Route path="/create" component={CreateRoomPage} />
          <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
            }}
          />
        </Switch>
      </Router>
    );
  }
}
