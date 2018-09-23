# Store the start time so we can compare against end time for duration
start=`date +%s`

# Notify of startup
echo ""
echo "--------------------------------------------------------------------------"
echo "------------------ Starting main platform deployment ---------------------"
echo "--------------------------------------------------------------------------"
echo ""

# Pull locales step
echo "--------------------- Pulling locales repository -------------------------"

echo ""
cd locales && git pull &&
echo "Pull complete √"
echo ""

echo "--------------------- Pulling frontend repository ------------------------"

echo ""
cd ../ && git pull &&
echo "Pull complete √"
echo ""

echo "------------------------ Updating dependencies ---------------------------"

echo ""
npm prune --production=false && npm i &&
echo "Update complete √"
echo ""

echo "----------------------- Performing Webpack build -------------------------"

echo ""
webpack --json > build/stats.json --verbose --colors --display-error-details --config config/prod.config.js &&
echo "Build complete √"
echo ""

echo "------------------------ Swapping dist directory -------------------------"

echo ""
rm -rf build/dist && mv build/dist-new build/dist &&
echo "Swap complete √"
echo ""

echo "--------------------------- Reloading cluster ----------------------------"

echo ""
pm2 gracefulReload main-platform
echo ""
echo "Reload complete √"
echo ""

echo ""
echo "-------------------------------- Ending ----------------------------------"
echo ""

end=`date +%s`

rtS1="Deployment took "
runtime=$((end-start))
rtS2=" seconds"
runtimeMessage=$rtS1$runtime$rtS2
echo $runtimeMessage

echo ""
echo "-------------------------- Deployment complete ---------------------------"
echo ""
