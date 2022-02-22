for file in components/**/*.scss
do
	sass $file $file.css
done
cat components/*/*.scss.css > components/components.css
sass css/niui-core.scss css/niui-core.css
cat css/niui-core.css components/components.css > dist/niui.css
./node_modules/clean-css-cli/bin/cleancss -o dist/niui.min.css dist/niui.css
rm components/components.css

./node_modules/rollup/dist/bin/rollup --no-treeshake --format=cjs -- js/niui-core.js components/**/*.js > dist/niui-temp.js
./node_modules/rollup/dist/bin/rollup  --no-treeshake --format=cjs --banner "window.nui = (() => {" --footer "initComponents(); return { initComponents, copyButton, componentModal, addComponent, componentNotify } })();" -- dist/niui-temp.js > dist/niui.js
rm dist/niui-temp.js
./node_modules/terser/bin/terser -o dist/niui.min.js --compress --mangle -- dist/niui.js
#gzip-size --raw n-carousel.min.css > n-carousel.min.css.size
gzip-size --raw dist/niui.min.js > dist/niui.min.js.size
gzip-size --raw dist/niui.min.css > dist/niui.min.css.size