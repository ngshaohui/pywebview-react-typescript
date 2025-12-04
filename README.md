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

Has been tested to be able to build with nuitka

```bash
uv run nuitka --standalone src/index.py
```

Not yet able to use `--onefile` flag as it will raise an exception `Exception: No index.html found`
