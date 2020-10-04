import React, { Component } from "react";
import RealEstateContract from "../../contracts/RealEstate.json";
import getWeb3 from "../../getWeb3";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InfoWindowEx from "./InfoWindowEx";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class Main extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    markers: [],
    ownerAccount: null,
    activeMarker: {},
    showingInfoWindow: false,
    addLandModal: false,
    addLandName: null,
    addLandLat: null,
    addLandLong: null,
    addLandPrice: 5,
    activeMarkerOwner: null,
    activeMarkerLat: null,
    activeMarkerLong: null,
    activeMarkerForSale: null,
    activeMarkerPrice: null,
    activeMarkerOwnerId: null,
    buyLandModal: false,
    sellLater: false,
    sellLandPrice: 5,
    buyLandNewName: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RealEstateContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RealEstateContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      this.getAccounts();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  getAccounts = async () => {
    const { accounts, contract } = this.state;
    //add owner account to state
    const ownerAddress = await contract.methods.owner().call();
    this.setState({ ownerAccount: ownerAddress });

    // get person count
    const personsCount = await contract.methods.personsCount().call();
    for (var i = 1; i <= personsCount; i++) {
      var land = await contract.methods.persons(i).call();
      const landLat = land[2];
      const landLong = land[3];
      var landMarks = [...this.state.markers];
      landMarks.push({
        title: land[1],
        name: land[1],
        position: { lat: landLat, lng: landLong },
        owner: land[6],
        price: land[5],
        forSale: land[4],
        id: land[0],
      });
      this.setState({ markers: landMarks });
    }
    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    // this.setState({ storageValue: response });
  };
  addMarker = async (t, map, coord) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        activeMarker: null,
        showingInfoWindow: false,
      });
    }

    if (this.state.ownerAccount == this.state.accounts[0]) {
      const { latLng } = coord;
      const lat = latLng.lat();
      const lng = latLng.lng();
      this.setState({
        addLandLat: lat,
        addLandLong: lng,
        addLandModal: true,
      });

      //   this.setState((previousState) => {
      //     return {
      //       markers: [
      //         ...previousState.markers,
      //         {
      //           title: "",
      //           name: "",
      //           position: { lat, lng },
      //         },
      //       ],
      //     };
      //   });
    }
  };
  handleOpen = () => {
    this.setState({
      addLandModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      addLandModal: false,
    });
  };
  handleBuyOpen = () => {
    this.setState({
      buyLandModal: true,
      sellLandPrice: this.state.activeMarkerPrice,
    });
  };

  handleBuyClose = () => {
    this.setState({
      buyLandModal: false,
    });
  };
  onMarkerClick = (props, marker, mark) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
      activeMarkerOwner: mark.name,
      activeMarkerForSale: mark.forSale,
      activeMarkerPrice: mark.price,
      activeMarkerOwnerId: mark.owner,
      activeMarkerLandId: mark.id,
      activeMarkerLat: mark.position.lat,
      activeMarkerLong: mark.position.lng,
    });
  };

  onInfoWindowClose = () => {
    this.setState({
      activeMarker: null,
      showingInfoWindow: false,
    });
  };
  addLandValueChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };
  handleSwitch = (event) => {
    this.setState({
      [event.target.id]: event.target.checked,
    });
  };
  addLandSubmit = async () => {
    const { accounts, contract } = this.state;
    await contract.methods
      .addPerson(
        this.state.addLandName,
        String(this.state.addLandLat),
        String(this.state.addLandLong),
        true,
        this.state.addLandPrice
      )
      .send({ from: accounts[0] });
    this.setState((previousState) => {
      return {
        markers: [
          ...previousState.markers,
          {
            title: this.state.addLandName,
            name: this.state.addLandName,
            position: {
              lat: this.state.addLandLat,
              lng: this.state.addLandLong,
            },
            owner: this.state.addLandName,
            price: this.state.addLandPrice,
            forSale: true,
          },
        ],
        addLandModal: false,
      };
    });
  };
  buyLand = async () => {
    const { accounts, contract } = this.state;
    await contract.methods
      .buyLand(
        this.state.activeMarkerLandId,
        this.state.buyLandNewName,
        this.state.activeMarkerLat,
        this.state.activeMarkerLong,
        this.state.sellLater,
        this.state.sellLandPrice
      )
      .send({
        from: accounts[0],
        value: parseInt(this.state.activeMarkerPrice),
      });
    this.setState({ buyLandModal: false });
  };

  render() {
    const useStyles = makeStyles((theme) => ({
      paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    }));
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div style={{ height: "100%", width: "100%" }}>
          <Map
            google={this.props.google}
            zoom={5}
            initialCenter={{ lat: 26.85, lng: 80.949997 }}
            onClick={(t, map, coord) => {
              this.addMarker(t, map, coord);
            }}
          >
            {this.state.markers.map((mark, index) => (
              <Marker
                key={index}
                title={mark.title}
                name={mark.name}
                position={mark.position}
                onClick={(props, marker) =>
                  this.onMarkerClick(props, marker, mark)
                }
              />
            ))}
            <InfoWindowEx
              marker={this.state.activeMarker}
              onClose={this.onInfoWindowClose}
              visible={this.state.showingInfoWindow}
            >
              <div>
                <h3 style={{ margin: 0 }}>
                  Owner: {this.state.activeMarkerOwner}
                </h3>
                <h3 style={{ margin: 0 }}>
                  For Sale: {this.state.activeMarkerForSale ? "Yes" : "No"}
                </h3>
                {this.state.activeMarkerForSale ? (
                  <div>
                    <h3 style={{ marginTop: 0.5 }}>
                      Price: {this.state.activeMarkerPrice} wei
                    </h3>
                    <div onClick={this.handleBuyOpen}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          console.log("yash");
                        }}
                      >
                        Buy Land
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </InfoWindowEx>
          </Map>

          <Modal
            open={this.state.addLandModal}
            onClose={this.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div
              style={{
                top: "50%",
                left: "40%",
                position: "absolute",
                backgroundColor: "white",
                width: 300,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TextField
                  required
                  id="addLandName"
                  label="Name"
                  defaultValue=""
                  onChange={this.addLandValueChange}
                />
                <TextField
                  disabled
                  id="addLandLat"
                  label="latitude"
                  defaultValue={this.state.addLandLat}
                  onChange={this.addLandValueChange}
                />
                <TextField
                  disabled
                  id="addLandLong"
                  label="longitude"
                  defaultValue={this.state.addLandLong}
                  onChange={this.addLandValueChange}
                />
                <TextField
                  required
                  id="addLandPrice"
                  label="Price in wei"
                  defaultValue="5"
                  onChange={this.addLandValueChange}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.addLandSubmit}
                >
                  Add Land
                </Button>
              </div>
            </div>
          </Modal>
          <Modal
            open={this.state.buyLandModal}
            onClose={this.handleBuyClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div
              style={{
                top: "50%",
                left: "40%",
                position: "absolute",
                backgroundColor: "white",
                width: 300,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",

                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 15,
                  borderRadius: 50,

                }}
              >
                <TextField
                  required
                  id="buyLandNewName"
                  label="New Name"
                  defaultValue=""
                  onChange={this.addLandValueChange}

                />
                <TextField
                  disabled
                  id="buyLandLat"
                  label="latitude"
                  defaultValue={this.state.activeMarkerLat}
                />
                <TextField
                  disabled
                  id="buyLandLong"
                  label="longitude"
                  defaultValue={this.state.activeMarkerLong}
                />
                <TextField
                  disabled
                  id="addLandPrice"
                  label="Price in wei"
                  defaultValue={this.state.activeMarkerPrice}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.sellLater}
                      onChange={this.handleSwitch}
                      color="primary"
                      name="sellLater"
                      id="sellLater"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }

                  label="Want to Sell Later?"
                />

                {this.state.sellLater ? (
                  <TextField
                    required
                    id="sellLandPrice"
                    label="Selling Price in wei"
                    defaultValue={this.state.activeMarkerPrice}
                    onChange={this.addLandValueChange}
                  />
                ) : null}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.buyLand}
                  style={{
                    width: 280,
                    alignContent: "center",
                  }}
                >
                  Buy Land
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div >
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAOaFVlbMi8uNw-Sok4swiCGTxewBjoTFM",
})(Main);
