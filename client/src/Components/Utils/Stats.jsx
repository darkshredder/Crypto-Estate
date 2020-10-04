import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import RealEstateContract from "../../contracts/RealEstate.json";
import getWeb3 from "../../getWeb3";
import CircularProgress from "@material-ui/core/CircularProgress";

const options = {
  legend: {
    position: "bottom",
    labels: {
      boxWidth: 20,
    },
  },
};

export default class Stats extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    ownerAccount: null,
    data: null,
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
      const personsCount = await instance.methods.personsCount().call();
      const sellers = await instance.methods.sellers().call();
      const data = {
        labels: ["Don't want to Sell ", "Want To Sell"],
        datasets: [
          {
            data: [personsCount - sellers, sellers],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
      this.setState({ data });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {this.state.data ? (
          <Doughnut data={this.state.data} options={options} />
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}
