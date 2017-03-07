echo ""
echo "--------------------------------------------------------------------------"
echo "------------------ Starting main platform deployment ---------------------"
echo "--------------------------------------------------------------------------"
echo ""

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

echo "-------------------------- Deployment complete ---------------------------"
