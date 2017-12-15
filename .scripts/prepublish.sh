#!/bin/bash

# IMPORTANT
# ---------
# This is an auto generated file with React CDK.
# Do not modify this file.
# Use `.scripts/user/prepublish.sh instead`.

echo "=> Transpiling 'src' into ES5 ..."
echo ""
rm -rf ./dist
NODE_ENV=production ./node_modules/.bin/babel --no-babelrc --ignore tests,stories --plugins "transform-runtime" --presets react-app ./src --out-dir ./dist

echo "=> Transpiling 'src' into ES6 ..."
NODE_ENV=production BABLE_ENV=es ./node_modules/.bin/babel --ignore tests,stories --plugins "transform-runtime" ./src --out-dir ./dist/es

echo ""
echo "=> Transpiling completed."

. .scripts/user/prepublish.sh
