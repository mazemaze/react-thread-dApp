// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "./ThreaderCoin.sol";

contract ThreaderBase is ThreaderCoin {
    address private ownerAddress;

    struct Post {
        uint256 id;
        string title;
        string content;
        uint256 likes;
    }

    struct Organization {
        uint256 id;
        address founder;
        string name;
        string description;
        Post[] posts;
        address[] members;
    }

    modifier checkIfTokensAvailable() {
        require(balanceOf(msg.sender) > 0);
        _;
    }

    constructor(uint256 initialSupply) ThreaderCoin(initialSupply) {
        ownerAddress = msg.sender;
        uint256 time = block.timestamp;
        Post memory initialPost = Post(
            time,
            "First Post",
            "This is my first content",
            0
        );

        allPosts.push(initialPost);
        ownerByPostId[time] = msg.sender;
        indexOfPostById[time] = allPosts.length - 1;
        postsByOwnerAndID[msg.sender][time] = (allPosts.length - 1);
        postsByOwnerAddress[msg.sender].push(allPosts.length - 1);
    }

    Post[] allPosts;
    Organization[] organizations;
    mapping(uint256 => uint256) numberOfOrgMember;
    mapping(uint256 => mapping(address => uint256)) indexOfOrgMember;
    mapping(uint256 => uint256) indexOfOrg;
    mapping(uint256 => Post[]) postsOfOrg;
    mapping(uint256 => address[]) membersOfOrg;

    mapping(uint256 => address) likedPost;
    mapping(uint256 => uint256) indexOfPostById;
    mapping(address => uint256[]) postsByOwnerAddress;
    mapping(address => mapping(uint256 => uint256)) postsByOwnerAndID;
    mapping(uint256 => address) ownerByPostId;

    function foundOrganization(string memory name, string memory description)
        public
    {
        uint256 time = block.timestamp;
        membersOfOrg[time].push(msg.sender);
        Post[] storage initP = postsOfOrg[time];
        Organization memory newOrg = Organization({
            id: time,
            founder: msg.sender,
            name: name,
            description: description,
            posts: initP,
            members: membersOfOrg[time]
        });
        numberOfOrgMember[time] = 1;
        indexOfOrgMember[time][msg.sender] = 0;
        indexOfOrg[time] = 0;
        organizations.push(newOrg);
        _giveTokenForActions(msg.sender, 5 * 10^18);
    }

    function joinOrganization(uint256 id) public {
        uint256 index = indexOfOrg[id];
        membersOfOrg[id].push(msg.sender);
        organizations[index].members = membersOfOrg[id];
        numberOfOrgMember[id] += 1;
        indexOfOrgMember[id][msg.sender] = organizations[index].members.length - 1;
    }

    function getOrganizations() public view returns (Organization[] memory){
        return organizations;
    }

    function getPostByOwnerAddress(address owner)
        public
        view
        returns (uint256[] memory)
    {
        return postsByOwnerAddress[owner];
    }

    function getOwnerByPostID(uint256 id) public view returns (address) {
        return ownerByPostId[id];
    }

    function getPostByOwnerAndID(address owner, uint256 id)
        public
        view
        returns (uint256)
    {
        return postsByOwnerAndID[owner][id];
    }

    function getIndexOfPost(uint256 id) public view returns (uint256) {
        return indexOfPostById[id];
    }

    function getLikedPost(uint256 index) public view returns (address) {
        return likedPost[index];
    }

    function addNewPost(string memory title, string memory content) public {
        uint256 time = block.timestamp;
        Post memory newPost = Post(time, title, content, 10);
        allPosts.push(newPost);
        indexOfPostById[time] = allPosts.length - 1;
        postsByOwnerAddress[msg.sender].push(allPosts.length - 1);
        ownerByPostId[time] = msg.sender;
        postsByOwnerAndID[msg.sender][time] = allPosts.length - 1;
        if (postsByOwnerAddress[msg.sender].length == 1) {
            _giveTokenForActions(msg.sender, 10 * 10^17);
        } else {
            _giveTokenForActions(msg.sender, 1 * 10^17);
        }
    }

    function increaseLike(address user, uint256 id) public {
        uint256 index = getIndexOfPost(id);
        require(
            likedPost[index] != msg.sender,
            "This account already liked this post"
        );
        allPosts[index].likes += 1;
        likedPost[index] = msg.sender;
        _giveTokenForActions(msg.sender, 1);
        _giveTokenForActions(user, 1);
    }

    function _giveTokenForActions(address user, uint256 amount) private {
        _transfer(ownerAddress, user, amount);
    }

    function getAllPosts() public view returns (Post[] memory) {
        return allPosts;
    }
}
