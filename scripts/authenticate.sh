#!/bin/sh
setup_git() {
    git config --global user.email "ichulinda@gmail.com"
    git config --global user.name "Igmat (Travis CI)"
    git remote remove origin
    git remote add origin https://${GH_TOKEN}@github.com/Igmat/baset.git
    git checkout master
}

setup_npm() {
    touch ../.npmrc.ci
    mv ../.npmrc.ci ../.npmrc
}

setup_git
setup_npm
