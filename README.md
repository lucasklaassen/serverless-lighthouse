# Serverless Lighthouse Package 

A package with all the required dependencies to run [Google Lighthouse](https://github.com/GoogleChrome/lighthouse) in a lambda function created through the [Serverless](https://www.serverless.com/) framework. 

It took me entirely too long to get Chrome, AWS Lambda, and Lighthouse to play nicely together. This package hopes to alleviate you of that misery.


## Installation

```bash
npm install --save serverless-lighthouse
```

### Usage

In your Lambda function code:

```ts
//Traditional node require
const lighthouse = require('serverless-lighthouse');

//ES6 import
import lighthouse from 'serverless-lighthouse';

const results = await lighthouse.runLighthouse(targetUrl);
```

You can optionally pass in flags to customize the run.

```ts
await lighthouse.runLighthouse(targetUrl, chromeFlags, lighthouseFlags, lighthouseConfig)
```

Default values will be used for optional arguments when they are not provided. These defaults can be accessed through the below functions. If you choose to pass in your own set of flags, I recommend adding them to the defaults provided.

Note: It is NOT recommended to modify the `port` property in the `lighthouseFlags`.

```ts
const lighthouse = require('serverless-lighthouse');
const chromeFlags = lighthouse.defaultChromeFlags;
const lighthouseFlags = lighthouse.defaultLighthouseFlags;
``` 

The default `lighthouseConfig` (below) is barebones and can be modified as needed.
```ts
{
    extends: 'lighthouse:default'
}
```
