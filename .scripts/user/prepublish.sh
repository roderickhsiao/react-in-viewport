# Use this file to your own code to run at NPM `prepublish` event.

echo ""
echo "=> Creating type definitions into dist/types ..."

yarn typings

echo "=> Type definitions created."
