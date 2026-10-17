#!/bin/bash
# Arma index.html (versión offline) a partir de src/app.html, que es la misma página que la versión de claude.ai
set -e
cd "$(dirname "$0")"
{ cat src/head.html; cat src/app.html; printf '\n<script>if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});</script>\n</body></html>\n'; } > index.html
v=$(date +%Y%m%d%H%M)
sed -i "s/const CACHE=\"acro-v[0-9]*\"/const CACHE=\"acro-v$v\"/" sw.js
echo "index.html armado, cache acro-v$v"
