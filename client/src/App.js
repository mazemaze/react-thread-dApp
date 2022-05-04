import React, { Component } from "react";
import SimpleStorageContract from "./contracts/ThreaderBase.json";
import getWeb3 from "./getWeb3";
import Web3 from "web3";
import "./App.css";
import Header from "./components/Header";
import PostItem from "./components/PostItem";

class App extends Component {
  state = {
    storageValue: 0, web3: null, accounts: null, contract: null, 
    posts: null, handleLikeButton: null, newPost: null,
    isLiked: null, createOrg: null, joinOrg: null, orgList: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.


    // Get the value from the contract to prove it worked.
    const response = await contract.methods.balanceOf(accounts[0]).call();

    const posts = await contract.methods.getAllPosts().call();

    const org = await contract.methods.getOrganizations().call();

    const likeMethod = async (id) => {
      const bigInt = Web3.utils.toBN(id);
      const address = await contract.methods.getOwnerByPostID(bigInt).call();
      await contract.methods.increaseLike(address, id).send({ from: accounts[0] });
      const newP = await contract.methods.getAllPosts().call();
      this.setState({ posts: newP })  
    }

    const likedPost = async (id) => {
      const index = await contract.methods.getIndexOfPost(id).call();
      const address = await contract.methods.getLikedPost(index).call();
      if(address === accounts[0]){
        return true;
      }
      return false;
    }

    const orgCreation = async (title, content) => {
      await contract.methods.foundOrganization(title, content).send({ from: accounts[0 ]});
      const org = await contract.methods.getOrganizations().call();
      this.setState({orgList: org});
    }

    const addPost = async (title, content) => {
      await contract.methods.addNewPost(title, content).send({from: accounts[0]});
      const newP = await contract.methods.getAllPosts().call();
      this.setState({ posts: newP })  
    }
    // Update state with the result.
    this.setState({ storageValue: response, posts: posts, handleLikeButton: likeMethod, newPost: addPost, isLiked: likedPost, createOrg: orgCreation, orgList: org });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header balance={this.state.storageValue} />
        <PostItem posts={this.state.posts} newPost={this.state.newPost} likeButton={this.state.handleLikeButton} isLiked={this.state.isLiked} orgList={this.state.orgList} />
      </div>
    );
  }
}

export default App;
