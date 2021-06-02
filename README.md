# Parse PHP to Markdown
Convert PHP source code into Markdown documentation. Can be used with GitHub's wiki project repos

## Example Use

### From JSON files

```js
const parser = require('parse-php-to-md');

parser({
    src: __dirname + '/json',
    dest: '/git/repo.wiki/docs',
    deleteJson: false,
    buildTOC: 'Table of Contents',
    buildSidebar: true,
}, function () {
    // Callback when completed
    console.log('Done!');
});

```

### From PHP source files

```js
const parser = require('parse-php-to-md');

console.time();
parser({
    src: {
        // "parse-php-to-json" config
        include: ['/git/repo/src', '.php'],
        exclude: ['vendor',],
        dest: __dirname + '/json',
        encoding: 'utf-8',
        meta: {
            name: "Some Project",
            description: "Some long description..."
        }
    },
    dest: '/git/repo.wiki/docs',
    deleteJson: true,
    buildTOC: true,
    buildSidebar: false,
}, function () {
    console.log('Done!');
    console.timeEnd();
});

```

#### TODO

* create optional non-flat structure relative linking (to be used outside of GitHub's wiki structure)
* optional user defined types ('public', 'private', 'constants', 'properties', etc)