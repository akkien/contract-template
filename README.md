# Contracts

## Develop Guide

### Commit message linter

Project use commitlint to format the commit message. Rules are in `commitlint.config.js`

More about commitlint: <https://commitlint.js.org/#/>

### Syntax checking

```sh
yarn solhint
```

### Static Analysing

Install Slither: `pip3 install slither-analyzer`

```sh
yarn slither
```

### Compile contracts

```sh
yarn compile
or
forge build
```

### Test

```sh
yarn test
or
forge test
```

### Deploy to network

```sh
yarn deploy
```

## Architect
