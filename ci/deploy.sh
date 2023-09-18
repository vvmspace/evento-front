rm ./public/robots.txt
cp ./public/robots.main.txt ./public/robots.txt
echo "Sitemap: ${URL_PREFIX}sitemap.xml" >>./public/robots.txt
echo "Host: $URL_PREFIX" >>./public/robots.txt