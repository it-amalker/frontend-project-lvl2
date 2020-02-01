# Hexlet frontend project II

## Difference generator
### CLI app, which compares two configuration files and shows a difference.

[![Maintainability](https://api.codeclimate.com/v1/badges/3c1a2ebe676f2d82a36f/maintainability)](https://codeclimate.com/github/it-amalker/frontend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3c1a2ebe676f2d82a36f/test_coverage)](https://codeclimate.com/github/it-amalker/frontend-project-lvl2/test_coverage)
[![Build Status](https://travis-ci.org/it-amalker/frontend-project-lvl2.svg?branch=master)](https://travis-ci.org/it-amalker/frontend-project-lvl2)

### Install app packages
#### First of all need to:
* [Clone](https://help.github.com/en/github/using-git/which-remote-url-should-i-use#cloning-with-https-urls-recommended) [this](https://github.com/it-amalker/frontend-project-lvl2.git) repository
* Install [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm#install--update-script)
* Install [Node.js](https://github.com/nvm-sh/nvm#usage) with nvm:
```
$ nvm install node
```
* Run these commands from cloned gendiff directory:
```
$ make install
$ make publish
```
### How to start app:
#### Supported file formats: JSON, YAML, INI
#### Supported output: default, plain, json
```
$ gendiff --format [output type] <pathToFile1> <pathToFile2>
```

#### Compare two JSON files with default output
[![asciicast](https://asciinema.org/a/295379.svg)](https://asciinema.org/a/295379)

#### Compare two YAML files with default output
[![asciicast](https://asciinema.org/a/295536.svg)](https://asciinema.org/a/295536)

#### Compare two INI files with default output
[![asciicast](https://asciinema.org/a/295619.svg)](https://asciinema.org/a/295619)

#### Compare two files recursively with default output
[![asciicast](https://asciinema.org/a/296088.svg)](https://asciinema.org/a/296088)

#### Compare two files recursively with plain output
[![asciicast](https://asciinema.org/a/296231.svg)](https://asciinema.org/a/296231)

#### Compare two files recursively with json output
[![asciicast](https://asciinema.org/a/296604.svg)](https://asciinema.org/a/296604)
