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

### DynamoDB database

- To use it, create an account in AWS, you can use it the Free Tier while developing.

- You can then set up the credentions locally by installing [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and running `aws configure`. Or just by setting the credentials in [config files](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

### Building dependencies and starting the service

- `npm install` - Build the dependencies
- `yarn build` - Do the webpack build process
- `yarn start` or `node server.js` - Start the service
