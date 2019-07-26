set -e
shopt -s extglob

TEMP_PATH=".tmp"
REPO_BASE="https://github.com/ccforeverd"
REPO_NAME=$1

echo ""
echo "repository $REPO_BASE/$REPO_NAME"
echo "deploy $REPO_NAME"
echo ""
echo "start ..."
echo ""

# build docs
# npm run docs:build

# exit()

rm -rf $TEMP_PATH

# prepare deploy
mkdir $TEMP_PATH
cd $TEMP_PATH
git clone $REPO_BASE/$REPO_NAME.git
cd $REPO_NAME
cp -r ../../dist/* .
# rm -rf ./!(old) # keep old version docs

# commit and push changes
git add -A
git commit --am --allow-empty -m "deploy $REPO_NAME"
# git pull origin master –allow-unrelated-histories
# git pull --rebase origin master
git pull origin master
git push origin master:master

cd '../../'
# rm -rf $TEMP_PATH

echo ""
echo "done!"
echo ""
