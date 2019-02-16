#!/bin/bash

# IMPORTANT
# ---------
# This is an auto generated file with React CDK.
# Do not modify this file.
# Use `.scripts/user/prepublish.sh instead`.

echo "=> Transpiling 'src' into ES5 ..."
echo ""
rm -rf ./dist
NODE_ENV=production BABEL_ENV=cjs ./node_modules/.bin/babel --ignore tests,stories ./src --out-dir ./dist

echo "=> Transpiling 'src' into ES6 ..."
NODE_ENV=production BABEL_ENV=es ./node_modules/.bin/babel --ignore tests,stories ./src --out-dir ./dist/es

echo "=> Transpiling 'src' into UMD ..."
NODE_ENV=production BABEL_ENV=umd ./node_modules/.bin/babel --ignore tests,stories ./src --out-dir ./dist/umd

echo "=> Transpiling 'src' into NEXT ..."
NODE_ENV=production BABEL_ENV=next ./node_modules/.bin/babel --ignore tests,stories ./src --out-dir ./dist/next

echo ""
echo "=> Transpiling completed."

. .scripts/user/prepublish.sh
