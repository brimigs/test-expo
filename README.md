# Solana Mobile Expo Template

This template is a ready-to-go Expo dApp that offers:

- Pre-installed standard SDKs like Mobile Wallet Adapter and `@solana/web3.js`
- Required polyfills like `react-native-get-random-values` and `Buffer` installed.
- Simple React UI Components like `ConnectWalletButton`, `RequestAirdropButton`, `SignMessageButton`.

**This is only fully functional on Android.**

## Tech Stack

- [Mobile Wallet Adapter](https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/js/packages/mobile-wallet-adapter-protocol) for connecting to wallets and signing transactions/messages
- [web3.js](https://solana-labs.github.io/solana-web3.js/) for constructing transactions and an RPC `connection` client.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/solana-mobile/solana-mobile-dapp-scaffold/assets/18451967/3d83d3dc-ab65-4a2c-881d-8a229f34e392" alt="Scaffold dApp Screenshot 1" width=300 />
    </td>
    <td align="center">
      <img src="https://github.com/solana-mobile/solana-mobile-dapp-scaffold/assets/18451967/2fd69bd4-834d-45e1-8c7a-f80b5b576c96" alt="Scaffold dApp Screenshot 3" width=300 />
    </td>
    <td align="center">
      <img src="https://github.com/solana-mobile/solana-mobile-dapp-scaffold/assets/18451967/cdd93c12-d9ff-4739-81af-92da5b90303a" alt="Scaffold dApp Screenshot 2" width=300 />
    </td>
  </tr>
</table>

<CTAButton label="View on GitHub" to="https://github.com/solana-mobile/solana-mobile-dapp-scaffold" />

## Prerequisites

- An [Expo](https://expo.dev/) account.
- React Native and Android Environment [setup](https://docs.solanamobile.com/getting-started/development-setup)
  - An Android device/emulator.
  - Install an MWA compliant wallet app on your device/emulator.

## Usage

### Initialization

Initialize the template with:

```
yarn create expo-app --template @solana-mobile/solana-mobile-expo-template
```

Choose your project name then navigate into the directory.

### Build and run the app

Follow the **["Running the app"](https://docs.solanamobile.com/react-native/expo#running-the-app)** section in the Expo Setup guide to launch the template as a custom development build.

## Troubleshooting

- `Metro has encountered an error: While trying to resolve module @solana-mobile/mobile-wallet-adapter-protocol...`

  - This is an on-going issue when using `npm install` to install the Expo template.
  - To mitigate, clean your project dependencies and reinstall with `yarn install`

- `The package 'solana-mobile-wallet-adapter-protocol' doesn't seem to be linked. Make sure: ...`

  - Ensure you are _NOT_ using Expo Go to run your app.
  - You need to be using an [Expo custom development build](https://docs.solanamobile.com/react-native/expo#custom-development-build), rather than Expo Go.

- `failed to connect to...`

  - This is an Expo error that can occur when trying to connect to the dev server on certain Wifi networks.
  - To fix, try starting the dev server with the `--tunnel` command (`npx expo start --dev-client --tunnel`)

- `Error: crypto.getRandomValues() not supported`
  - This is a polyfill issue when trying to use certain functions from the `@solana/web3.js` in a React Native/Expo environment.
  - To fix, ensure your App properly imports and uses the polyfills like in this [guide](http://docs.solanamobile.com/react-native/expo#step-3-update-appjs-with-polyfills).

<br>

- `error Failed to load configuration of your project.`
  - Same as above, but for `yarn`. [Uninstall and reinstall](https://github.com/react-native-community/cli#updating-the-cli) the CLI through yarn.

<br>

- `Looks like your iOS environment is not properly set`:
  - You can ignore this during template initialization and build the Android app as normal. This template is only compatible with Android.

<br>

- `Usage Error: It seems you are trying to add a package using a https:... url; we now require package names to be explicitly specified.`
  - This error happens on certain versions of `yarn`, and occurs if you try to initialize the template through the Github repo URL, rather than the npm package. To avoid this, use the `@solana-mobile/solana-mobile-dapp-scaffold` package as specified, or downgrade your `yarn` version to classic (1.22.x).

<br>

- `error Couldn't find the ".../@solana-mobile/solana-mobile-dapp-scaffold/template.config.js file inside "@solana-mobile/solana-mobile-dapp-scaffold" template.`

  - This is a [known error](https://github.com/react-native-community/cli/issues/1924) that occurs with certain versions of `yarn` (>= 3.5.0). It is fixed by running the cli command with the `--npm` flag or downgrading your version of `yarn`.

- `error: You don't have the required permissions to perform this operation.`
  replace your app id in the app.json with the one that was created in your expor account under projects in expo dashboard: https://expo.dev/accounts/yourname/projects/yourappname
  Also make sure to add the correct app name in the app.json file.

# Run locally:

Follow the guide here:
https://docs.solanamobile.com/react-native/expo#running-the-app

Then run the build with

```bash
npx eas build --profile development --platform android --local
```

Follow the guide here: https://reactnative.dev/docs/environment-setup?package-manager=yarn&guide=native&platform=android
to add your android sdk to path.

Install JDK
Install Android Studio and Android SDK

Probably need to to these steps:

Add the following lines to your ~/.zprofile or ~/.zshrc (if you are using bash, then ~/.bash_profile or ~/.bashrc) config file:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
````

Then use the following command to install the apk:

```bash
adb install /Users/jonasmac2/Documents/GitHub/test-expo/expoTest/build-1714141154700.apk
```

Then run the app with:

```bash
npx expo start --dev-client
```

then press a to run the app on the connected device or emulator.
