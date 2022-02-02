# @s-ui/sass-loader

Optimized sass-loader for Webpack@5.

*Fork of [fast-sass-loader](https://github.com/yibn2008/fast-sass-loader)*


**Features:**

- 5~10 times faster than `sass-loader` in large sass project
- Support sass file dedupe, never worry about `@import` same file in different place
- Support url resolve, never worry about the problem with `url(...)` (see https://github.com/webpack-contrib/sass-loader#problems-with-url)


### Why `@s-ui/sass-loader` is faster than `sass-loader` ?

1. Support SCSS file dedupe, so `node-sass` won't compile same file repeatedly, the performance improvement is significant when your sass files number grows very large.
2. Before sass compilation, it will merge all sass files into a single file, so *sass* only need to compile one large file.
3. The internal cache will store all result for every entry, only compile sass when related file changed.

## Install

install by npm:

```javascript
npm install @s-ui/sass-loader --save-dev
```

and you need install **sass** and **webpack** as peer dependencies.

## Configuration

## Options

### includePaths:

An array of paths that [node-sass](https://github.com/sass/node-sass) can look in to attempt to resolve your @import declarations. When using data, it is recommended that you use this.

### data:
If you want to prepend Sass code before the actual entry file, you can set the data option. In this case, the loader will not override the data option but just append the entry's content. This is especially useful when some of your Sass variables depend on the environment:

```javascript
{
    loader: "fast-sass-loader",
    options: {
      data: "$env: " + process.env.NODE_ENV + ";"
    }
}
```

Please note: Since you're injecting code, this will break the source mappings in your entry file. Often there's a simpler solution than this.

### transformers:

If you want to import files that aren't basic SCSS or CSS files, you can use the transformers option. This option takes an array of transformer entries, each with a list of file extensions and a tranform function. If an imported file's extension matches one of the transformers' extensions, the file contents will be passed to the corresponding transform function. Your transform function should return a sass string that will be directly written into your compiled Sass file. This is especially useful if you use .json files to share your basic styles across platforms and you'd like to import your .json files directly into your SASS.

```javascript
{
  loader: "fast-sass-loader",
  options: {
    transformers: [
      {
        extensions: [".json"],
        transform: function(rawFile) {
          return jsonToSass(rawFile);
        }
      }
    ]
  }
}
```

### outputStyle:
The outputStyle option is passed to the render method of node-sass. See [node-sass OutputStyle](https://github.com/sass/node-sass/blob/master/README.md#outputstyle). This can be used to create smaller css files if set to "compressed".

### resolveURLs:
By default `fast-sass-loader` resolves and rewrites paths inside `url()`. This behavior can be turned off with `resolveURLs: false` option so all URLs will remain intact.

## Warning

### Mixing import `.scss` and`.sass` file is not allowed

Since `@s-ui/sass-loader` will parse `@import` and merge all files into single sass file, you cannot import `.scss` file from `.sass` (or opposite).

For example:

```scss
// file: entry.scss
@import "path/to/file.sass";  // cannot import `path/to/file.sass` in a `.scss` file

body {
  background: #FFF;
}
```

### Avoid same variable name in different sass files

Since `@s-ui/sass-loader` will dedupe sass file, later imported file will be ignored. Using same variable name in different SCSS files fill would produce unexpected output.

For example (compile `entry.scss` with @s-ui/sass-loader):

```sass
// a.scss
$foobar: #000;
```

```sass
// b.scss
@import "a.scss";
$foobar: #AAA;

h1 { color: $foobar; }
```

```sass
// entry.scss
@import "b.scss";
@import "a.scss"; // this file will be ignore: $foobar === #AAA

h2 { color: $foobar; }

// will output:
// h1 { color: #AAA; }
// h2 { color: #AAA; }
```

You can use variable prefix to bypass.

### Avoid nested @import in sass rules

fast-sass-loader doesn't support `@import` statement in sass rules, for example:

```sass
.a {
  @import 'group'
}

.b {
  @import 'group'
}
```

You should wrap the rules that you want to import with mixin, then include them in your `.a { ... }` or `.b { ... }`

## License

MIT
