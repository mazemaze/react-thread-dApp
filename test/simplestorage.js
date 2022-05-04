const ThreaderBase = artifacts.require("./ThreaderBase.sol");

const TOTAL_SUPPLY = 100000;

contract("ThreaderBase", accounts => {
  let TB = null;
  let account1 = null;
  let account2 = null;
  let account3 = null;

  before(async () => {
    TB = await ThreaderBase.deployed(TOTAL_SUPPLY);
    let accounts = await web3.eth.getAccounts();
    account1 = accounts[0];
    account2 = accounts[1];
    account3 = accounts[2];
  });

  it("Symbol should be THD", async () => {
    const symbol = await TB.symbol();
    assert(symbol, "THD");
  })

  it("Total Supply should be 100000", async () => {
    const totalSupply = await TB.totalSupply();
    assert.equal(totalSupply.toString(), "100000")
  });

  it("Add a new post and check if user get tokens", async () => {
    await TB.addNewPost("明日", "ご飯食べる", {from: account2});
    await TB.addNewPost("機能", "ご飯食べた", {from: account2});
    const posts =  await TB.getPostByOwnerAddress({from: account2});
    assert(posts.length == 2);
    const balance = await TB.balanceOf(account2);
    assert(balance.toString() == "11");
  })

  it("Balance should be increased when users liked a post or get likes", async () => {
    await TB.addNewPost("明日", "ご飯食べる", {from: account2});
    await TB.addNewPost("機能", "ご飯食べた", {from: account2});
    await TB.increaseLike(account2, 0, {from: account3});
    await TB.increaseLike(account2, 1, {from: account3});
    await TB.increaseLike(account2, 1, {from: account1});
    const accountTwoBalance = await TB.balanceOf(account2);
    const accountThreeBalance = await TB.balanceOf(account3);
    assert(accountTwoBalance.toString() === "16");
    assert(accountThreeBalance.toString() === "2");
  })


});
