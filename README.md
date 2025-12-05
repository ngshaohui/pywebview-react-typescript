# React + TypeScript + Vite + Pywebview

Marginally improved typing for using React + Typescript with Pywebview.

This is an adaption of the [react boilerplate](https://github.com/r0x0r/pywebview-react-boilerplate) by Pywebview's author.

## Usage

The scripts have been written/adapted to mirror the original boilerplate's functionalities.

As always, refer to the `package.json` file before running any scripts.

### Installation

This installs the dependencies via both `uv` and `npm`. This is required for the very first run

```bash
npm run init
```

### Running/Developing

This builds the web application with `vite`, and runs the python application (serving the web application with `bottle`).

```bash
npm run start # can be shortened to `npm start`
```

This will generally be the command to run during development.

### Building

Currently **only builds for windows** until I have time to test on other platforms.

If necessary, use the `build` and `clean` scripts (and other build files) from the original boilerplate for other platforms.

```bash
npm run build # this builds with pyinstaller
```

## Pimped `src/hooks/pythonBridge.ts`

The original `pythonBridge.js` has been improved with typing, error handling, as well as unregistering event listeners on unmount to prevent leakage.

`usePythonState` now subscribes to a specific `propName`.

`usePythonApi` has been made to resemble the `useSWR` library, though a lot more functionality is needed to provide configurable options. As it is, it's sufficient in handling basic API calls and error handling.

Also added `usePlatform` and `useWebviewToken` though they haven't been extensively tested.
