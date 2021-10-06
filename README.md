# LionGov

Website: https://www.liongov.io/

v1.2 - basic proposals feature; fixed double voting problem; additional security stuff (signature verification)  
v1.1 - Integrated @imsys' code to do vote weight calculation; store vote weight in database and display on site.  
v1.0 - Web app that signs votes and stores in database; thanks @imsys for authentication and vote calculation code! need to integrate the vote calculation part still

## Setting the server

### Moralis API key

Grap a [Moralis API key](https://moralis.io/) and export them as an environmental variable. Save it in your `~/.bashrc`

```
export MORALIS_SERVER_URL=
export MORALIS_APP_ID=
```

It's possible to cache the voting points weight and save stressing Moralis servers. Just set `LIONGOV_CACHE_TIME` to the time in seconds you believe to be necessary. It will store in DynamoDB. If you prefer to store in Redis, just set `LIONGOV_CACHE_REDIS` with the connection string to the server, and the app will use it instead of DynamoDB. In caching (TTL - Time to live), Redis is much more time precise than DynamoDB, in Dynamo it may take some more minutes than what is set in the configuration.

```
export LIONGOV_CACHE_TIME=600   # 10 minutes
export LIONGOV_CACHE_REDIS=redis://localhost
```

### DynamoDB database

- To use it, create an account in AWS, you can use it the Free Tier while developing.

- You can then set up the credentions locally by installing [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and running `aws configure`. Or just by setting the credentials in [config files](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

If you install the AWS CLI, you can quickly set up all the tables with the following commands:

Votes Table:

```bash
aws dynamodb create-table --table-name Votes --attribute-definitions \
        AttributeName=VoteClass,AttributeType=S \
        AttributeName=WalletAddress,AttributeType=S \
	AttributeName=CreationTime,AttributeType=S \
    --key-schema \
        AttributeName=VoteClass,KeyType=HASH \
        AttributeName=WalletAddress,KeyType=RANGE \
    --global-secondary-indexes \
        IndexName=VoteClass-CreationTime-index,KeySchema=["\
{AttributeName=VoteClass,KeyType=HASH}","\
{AttributeName=CreationTime,KeyType=RANGE}"],\
Projection="{ProjectionType=ALL}",ProvisionedThroughput="\
{ReadCapacityUnits=1,WriteCapacityUnits=1}"\
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1
```

Proposals Table:
```bash
aws dynamodb create-table --table-name Proposals --attribute-definitions \
        AttributeName=VoteClass,AttributeType=S \
        AttributeName=ProposalId,AttributeType=S \
    --key-schema \
        AttributeName=VoteClass,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1
```

Cache Table: (Optional)
```bash
aws dynamodb create-table --table-name Cache --attribute-definitions \
        AttributeName=Key,AttributeType=S \
    --key-schema \
        AttributeName=Key,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1
```

Set Cache TTL attribute.
```bash
aws dynamodb update-time-to-live --table-name Cache --time-to-live-specification "Enabled=true, AttributeName=ttl"
```

### Building dependencies and starting the service

- `yarn` - Build the dependencies
- `yarn build` - Do the webpack build process
- `yarn start` - Start the service

## Debugging / development mode

Open two console instanses:
- Run the server with `yarn debug`. You can debug the server side by going to Google Chorme (or Chromium) [chrome://inspect/](chrome://inspect/), there should appear an "inspect" option there under "Remote Target".
- Run the front end with `yarn dev` and open the browser at http://localhost:8080/ you should be able to develop/debug using javascript source files. (unminified)

