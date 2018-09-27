# Swift-Pig

is a quick-and-dirty static templating command line utility.

![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)

## usage

```shell
$ swpg <entry_path> <data_path> [--img=<image_path>] [--out=<dist_path>] [-w | --watch]
```

**examples**
```
$ swpg index.js.html dev/data.js --imgs=dev/images --out=build/
$ swpg testpage.js.html dev/data.js --out=test/ -w
```

## data

Data can either be a JSON file or a JS file that exports either an object literal or JSON.

**kittens.json**
```json
{
  "name": "Samson",
  "description": "long haired Maine coon",
  "about": "Found abandoned in a cardboard box by the freeway"
}
```

**time.js**
```js
function getEpoch() {
  return +(new Date());
}
module.exports = {
  get time(){
    return getEpoch()
  }
}
```

## images

If you provide Swift-pig with an image path it will recursively crawl it to create an image map.

**images/**
```
images/
├── cat-1.jpg
└── cat-2.jpg

```

**image data**
```json
{
  "cat-1.jpg" : {
    "src": "rel/path/to/cat-1.jpg",
    "width": "640px",
    "height": "426px"
  },
  "cat-2.jpg" : {
    "src": "rel/path/to/cat-2.jpg",
    "width": "640px",
    "height": "480px"
  }
}
```
## templates

Template files follow the naming convention `*.js.*` where `*` is any alphanumeric character. This is just the name, in reality all template files are javascript and should export a function that takes content data and image data parameters and returns a string: `module.exports = function(d,i){ return "..."}`.

The entry template is the base template file you want to render.

**index.js.html**
```html
const infoBox = require('./templates/infoBox.js.html');
module.exports = (d,i) => `
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html" charset="UTF-8">
  <link rel="stylesheet" href="styles.css">
  <title>${d.title}</title>
</head>
<body>
  ${d.cats.map(info => infoBox(info,i,info.image)).join('')}
</main>
</body>
</html>`
```

**infoBox.js.html**
```html
const image = (i,fp) => `<img src="${i[fp].src}" width="${i[fp].width}" height="${i[fp].height}"/>`
module.exports = (d,i,img) => `
<section>
  <h1>${d.name}</h1>
  <p>
    <strong>description:</strong>
    ${d.description}</p>
  <p>
    <strong>about:</strong>
    ${d.about}
  </p>
  ${image(i,img)}
</section>`
```
As seen above, if a template wants to use another template all it has to do is import it b/c everything is JS.

## how to use

I haven't uploaded Swift-pig to a package manager yet so if you want to use it locally run the following in terminal:

`$ git clone https://github.com/jzwood/swift-pig.git && cd swift-pig && yarn install && yarn link`

## LICENCE

MIT
