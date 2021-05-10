#!/bin/bash

# Required
domain=${1:-"sfdc-dev"}
echo "DOMAIN=$domain" >> .env

# Dependecy check for jq,openssl
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# ToDo: Remove Warning
source "$SCRIPT_DIR/common/check-dependencies.sh"
check_preconditions

# Define variable Source
source="config/certs.json"

# Company details
country=$(jq '.certDetails.country' $source | tr -d '"')
state=$(jq '.certDetails.state' $source | tr -d '"')
locality=$(jq '.certDetails.locality' $source | tr -d '"')
organization=$(jq '.certDetails.organization' $source | tr -d '"')
organizationalunit=$(jq '.certDetails.organizationalunit' $source | tr -d '"')
email=$(jq '.certDetails.email' $source | tr -d '"')
keysize=$(jq '.certDetails.keysize' $source | tr -d '"')
password=""

if [ -z "$domain" ]
then
    echo "Argument not present."
    echo "Usage $0 <domain>"
    exit 99
fi

echo "Generating key request for $domain"

# Generate a key
openssl genrsa -des3 -passout pass:"$password" -out "certs/$domain.key" $keysize -noout

# Create crt file
# IG (ignore) value is purposefully introduced to avoid ignoring the field values in other Operating Systems
openssl req -newkey rsa:"$keysize" \
-x509 \
-sha256 \
-days 3650 \
-nodes \
-out "certs/$domain.crt" \
-keyout "certs/$domain.key" \
-passin pass:"$password" \
-subj "//IG=$country/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$domain/emailAddress=$email"

echo "-------------------------------------------------------"
echo "--Below is your CRT (available at your root directory)-"
echo "-------------------------------------------------------"
echo
cat "certs/$domain.crt"
