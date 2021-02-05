# Splits Converter
A small tool that can convert [LiveSplit](http://livesplit.org/) splits to [rift](https://github.com/vktec/rift) splits.

## Installation

### Prerequisites
+ Yarn or NPM
+ Git
+ TypeScript

### Instructions
+ Clone this repository: `git clone https://github.com/TrojanerHD/SplitsConverter`
+ cd into it: `cd SplitsConverter`
+ Compile TypeScript: `tsc -p .`

## Usage
The program has two modes. It can either ask for input or you provide input as program parameters.

### Parameter usage
The program takes one parameter via terminal: the input file, either as absolute or as relative path.
`node build/index.js [input-file]`

### Question usage
Disadvantage: No auto-completion upon entering the file name.
`node build/index.js`