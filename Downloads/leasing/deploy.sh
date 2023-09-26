#!/bin/bash
# CREATE IMAGE TAG
export FINAL_IMAGE=$DOCKER_HUB_REPO:$BITBUCKET_BUILD_NUMBER

# EXTRACT KUBERNETES TOKEN
echo $KUBE_TOKEN | base64 -d > ./kube_token
echo $KUBE_CA | base64 -d > ./kube_ca

# KUBECTL SETTINGS
kubectl config set-cluster $KUBE_CLUSTER --server=$KUBE_SERVER --certificate-authority="$(pwd)/kube_ca"
kubectl config set-credentials $KUBE_USERNAME --token="$(cat ./kube_token)"
kubectl config set-context default --cluster=$KUBE_CLUSTER --user=$KUBE_USERNAME
kubectl config use-context default

# UPDATE DEPLOYMENT WITH NEWLY BUILT DOCKER IMAGE.
kubectl set image deployment/$KUBE_DEPLOYMENT_NAME $KUBE_DEPLOYMENT_NAME=$FINAL_IMAGE