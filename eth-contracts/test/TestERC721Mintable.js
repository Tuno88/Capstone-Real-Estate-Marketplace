var ERC721MintableComplete = artifacts.require("CustomERC721Token");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      await this.contract.mint(account_one, 1);
      await this.contract.mint(account_two, 2);
      await this.contract.mint(account_two, 3);
      await this.contract.mint(account_three, 4);
      await this.contract.mint(account_three, 5);
    });

    it("should return total supply", async function () {
      let allTokens = this.contract.totalSupply.call();
      assert.equal(allTokens, 5, "Do not match total Supplies");
    });

    it("should get token balance", async function () {
      let tokenBalance = this.contract.balanceOf.call(account_one);
      assert.equal(tokenBalance, 1, "Do not match token balance");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let tokenURI = this.contract.tokenURI.call(1);
      assert.equal(
        tokenURI,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
        "NOT match token URI"
      );
    });

    it("should transfer token from one owner to another", async function () {
      this.contract.transferFrom.call(account_one, account_two, 1);
      let newOwner = this.contract.ownerOf.call(1);
      assert.equal(
        newOwner,
        account_two,
        "NOT match token owner after transfer"
      );
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let result = false;
      try {
        await this.contract.mint.call(account_three, 5, { from: account_two });
      } catch (e) {
        result = true;
      }
      assert.equal(
        result,
        true,
        "should fail when minting when address is NOT contract owner"
      );
    });

    it("should return contract owner", async function () {
      let owner = await this.contract.getOwner.call();
      assert.equal(owner, account_one, "should return contract owner");
    });
  });
});
