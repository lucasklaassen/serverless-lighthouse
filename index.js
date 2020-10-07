const launcher = require("chrome-launcher");
const chromium = require('chrome-aws-lambda');
const lighthouse = require('lighthouse');

async function runLighthouse(url, chromeFlags = null, lighthouseFlags = null, lighthouseConfig = null) {
    const flags = lighthouseFlags || {
        disableCpuThrottling: true,
        disableNetworkThrottling: true,
        port: undefined
    };

    const defaultFlags = chromeFlags || [
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--no-sandbox',
        '--single-process',
        '--hide-scrollbars'
    ];

    const lhConfig = lighthouseConfig || {
        extends: 'lighthouse:default'
    };

    const launcherOptions = {
        chromeFlags: defaultFlags
    };

    //Only set the chromePath if actually executing in a lambda
    if (process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) {
        console.log("Set prod stuff");
        launcherOptions['chromePath'] = await chromium.executablePath;
        console.log("Finish");
    }

    console.log('Running Command')

    const command = await launcher.launch(launcherOptions)
        .then((chrome) => {
            console.log("Port is: ", chrome.port);
            flags.port = chrome.port;
            return {
                chrome,
                start () {
                    console.log("Start!!!", JSON.stringify(chrome));
                    return lighthouse(url, flags, lhConfig)
                }
            }
        });

    return await command.start();
}

function getDefaultChromeFlags() {
    return [
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--no-sandbox',
        '--single-process',
        '--hide-scrollbars'
    ];
}

function getDefaultLighthouseFlags() {
    return {
        disableCpuThrottling: true,
        disableNetworkThrottling: true,
        port: undefined
    };
}

module.exports = {
    runLighthouse: runLighthouse,
    defaultChromeFlags: getDefaultChromeFlags(),
    defaultLighthouseFlags: getDefaultLighthouseFlags()
};
