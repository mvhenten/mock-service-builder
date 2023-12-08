PUBLISHED=$(npm view . version)
CURRENT=$(cat package.json | grep version | cut -c 14-20 | sed 's|"||g')
if [ "$PUBLISHED" != "$CURRENT" ]; then
    npm publish
fi