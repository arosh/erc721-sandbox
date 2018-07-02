#!/bin/bash
(
  cd truffle
  truffle migrate
)
node_modules/.bin/http-server
