# Hexlet frontend project II

## Difference generator
[<img src="./asciinema/welcome.svg">](https://asciinema.org/a/297180)
### CLI app, which compares two configuration files and shows a difference.

[![Maintainability](https://api.codeclimate.com/v1/badges/3c1a2ebe676f2d82a36f/maintainability)](https://codeclimate.com/github/it-amalker/frontend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3c1a2ebe676f2d82a36f/test_coverage)](https://codeclimate.com/github/it-amalker/frontend-project-lvl2/test_coverage)
![](https://github.com/it-amalker/frontend-project-lvl2/workflows/Github%20Actions/badge.svg)
[![Build Status](https://travis-ci.org/it-amalker/frontend-project-lvl2.svg?branch=master)](https://travis-ci.org/it-amalker/frontend-project-lvl2)

### Install packages
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
[<img src="./asciinema/publish.svg">](https://asciinema.org/a/297173)
### How to start app:
#### Supported file formats: JSON, YAML, INI
#### Supported output: default, plain, json
```
$ gendiff --format [output type] <pathToFile1> <pathToFile2>
```
#### Comparing two JSON files
[<img src="./asciinema/json.svg">](https://asciinema.org/a/295379)

#### Comparing two YAML files
[<img src="./asciinema/yaml.svg">](https://asciinema.org/a/295536)

#### Comparing two INI files
[<img src="./asciinema/ini.svg">](https://asciinema.org/a/295619)

#### Comparing two files recursively with default output
[<img src="./asciinema/recursive-default.svg">](https://asciinema.org/a/296088)

#### Comparing two files recursively with plain output
[<img src="./asciinema/recursive-plain.svg">](https://asciinema.org/a/296231)

#### Comparing two files recursively with json output
[<img src="./asciinema/recursive-json.svg">](https://asciinema.org/a/296604)
