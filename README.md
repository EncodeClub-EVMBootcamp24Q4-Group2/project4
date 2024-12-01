# Project 4
* Create a voting dApp to cast votes, delegate and query results on chain
* Request voting tokens to be minted using the API
* (bonus) Store a list of recent votes in the backend and display that on frontend
* (bonus) Use an oracle to fetch off-chain data
  * Use an oracle to fetch information from a data source of your preference
  * Use the data fetched to create the proposals in the constructor of the ballot

### Voting dApp integration guidelines

* Build the frontend using Scaffold ETH 2 as a base
* Build the backend using NestJS to provide the `Mint` method
  * Implement a single POST method
    * Request voting tokens from API
* Use these tokens to interact with the tokenized ballot
* All other interactions must be made directly on-chain

## Deploy token
- MyToken address: 0x5064c5eed17f73c3711adef19c87652a2113277f

## Deploy ballot
- Ballot address: 0x86b0bfbb2c857723c1ee88a188f951db6987b229
- Proposals:  [ 'Vanilla', 'Chocolate', 'Strawberry' ]

## Frontend
- Implemented frontend to mint token linking to backend POST mint-token endpoint
- Implemented frontend UI for voting, NOT connected to the backend POST vote endpoint
  - The vote counter is also a frontend coutner only, not connected to the ballot or ballot API. 
![Project 4 Frontend Mint Token](/img/project4_frontend_mintToken.png)

## Backend
![Project 4 Backend API](/img/project4_backend_API.png)
### MyToken Endpoints
- GET/contract-address, token-name, total-supply, token-balance/{address}, transaction-receipt, server-wallet-address
- POST/mint-tokens, example { "address": "0xAddress", "amount": "1"}

### Tokenized Ballot Endpoints
- GET/winning-proposal, voting-results
- POST/vote, example {"proposal": 1, "amount": "1"}
- These endpoints are not used per project guideline