#!/usr/bin/env bash

NC=$'\e[0m' # No Color
BOLD=$'\033[1m'
UNDERLINE=$'\033[4m'
RED=$'\e[31m'
GREEN=$'\e[32m'
BLUE=$'\e[34m'


function raise_error(){
  echo "${1}" >&2
  exit 1
}

function check_preconditions() {
  if ! [ -x "$(command -v jq)" ]; then
    raise_error "${RED}jq is not installed. Exiting...${NC}"
    exit 1
  fi

  if ! [ -x "$(command -v openssl)" ]; then
    raise_error "${RED}openssl is not installed. Exiting...${NC}"
    exit 1
  fi

}
