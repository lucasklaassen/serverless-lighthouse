const launcher = require("chrome-launcher");
const chromium = require("chrome-aws-lambda");
const lighthouse = require("lighthouse");
const log = require("lighthouse-logger");

async function runLighthouse(
  url,
  chromeFlags = null,
  lighthouseFlags = null,
  lighthouseConfig = null
) {
  const flags = lighthouseFlags || {
    disableCpuThrottling: true,
    disableNetworkThrottling: true,
    port: undefined,
  };

  const defaultFlags = chromeFlags || [
    "--headless",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-zygote",
    "--no-sandbox",
    "--single-process",
    "--hide-scrollbars",
  ];

  const lhConfig = lighthouseConfig || {
    extends: "lighthouse:default",
  };

  const launcherOptions = {
    chromeFlags: defaultFlags,
  };

  log.setLevel('info');

  //Only set the chromePath if actually executing in a lambda
  if (process.env.ENVIRONMENT === "production") {
    launcherOptions["chromePath"] = await chromium.executablePath;
  }

  // https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md
  let chrome = null;
  try {
    chrome = await launcher.launch(launcherOptions);
    flags.port = chrome.port;
    const results = lighthouse(url, flags, lhConfig);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }

  return await results;
}

function getDefaultChromeFlags() {
  return [
    "--headless",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-zygote",
    "--no-sandbox",
    "--single-process",
    "--hide-scrollbars",
  ];
}

function getDefaultLighthouseFlags() {
  return {
    disableCpuThrottling: true,
    disableNetworkThrottling: true,
    port: undefined,
  };
}

module.exports = {
  runLighthouse: runLighthouse,
  defaultChromeFlags: getDefaultChromeFlags(),
  defaultLighthouseFlags: getDefaultLighthouseFlags(),
};
