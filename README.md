# mv.js

[![Latest version](https://img.shields.io/npm/v/@unixcompat/mv.js)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/@unixcompat/mv.js)
](https://www.npmjs.com/package/@unixcompat/mv.js)
[![Coverage](https://codecov.io/gh/prantlf/mv.js/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/mv.js)

Moves or renames files or directories like the `mv` command.

There are multi-platform file-system commands compatible with `mv` from UN*X implemented for Node.js in JavaScript, like [renamer], but they have different interface and different behaviour than the `mv` command. Instead of reusing the knowledge of the `mv` command, you would have to learn their new interface. This project aims to provide the well-known interface of the `mv` command.

This package offers only command-line interface, because programmatic interface is provided by [`rename`] from [node:fs]. See also other commands compatible with their counterparts from UN*X - [cat.js], [cp.js], [ln.js], [mkdir.js] and [rm.js].

## Synopsis

The following scripts from `package.json` won't work on Windows:

    rm -rf dist
    mkdir -p dist
    cat src/umd-prolog.txt src/code.js src/umd-epilog.txt > dist/index.umd.js
    cp src/index.d.ts dist
    mv LICENSE doc

Replace them with the following ones, which run on any operating system which is supported by Node.js:

    rm.js -rf dist
    mkdir.js -p dist
    cat.js src/umd-prolog.txt src/code.js src/umd-epilog.txt > dist/index.umd.js
    cp.js src/index.d.ts dist
    mv.js LICENSE doc

Notice that the only difference is the suffix `.js` behind the command names.

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 16.15 or newer.

```sh
$ npm i -D @unixcompat/mv.js
$ pnpm i -D @unixcompat/mv.js
$ yarn add -D @unixcompat/mv.js
```

## Command-line Interface

See also `man mv` for the original [POSIX documentation] or for the extended [Linux implementation].

    Usage: mv.js [-Dfnv] [--] src... dest

    Options:
      -c|--cwd <dir>              directory to start looking for the source files
      -D|--dry-run                only print paths of source files or directories
      -f|--force                  removes the destination if not writable
      -n|--no-clobbering          prevents accidentally overwriting any files
      -v|--verbose                print path of each copied file or directory
      -V|--version                print version number
      -h|--help                   print usage instructions

    Examples:
      $ mv.js prog.js prog.bak
      $ mv.js jones smith /home/nick/clients

## Differences

The following options are specific to this command:

    -D|--dry-run    only print path of each file or directory
    -c|--cwd <dir>  directory to start looking for the source files

Also, the arguments may be [BASH patterns]. The pattern matching will ignore symbolic links. The argument `-c|--cwd` will be used only as a base directory to expand the BASH patterns in.

The following options from the POSIX version are not supported:

    -i    write a prompt to standard error before copying to any existing
          destination file. If the response from the standard input is
          affirmative, the copy shall be attempted; otherwise, it shall not.

The following options from the Linux version are not supported:

    --backup[=CONTROL]
          make a backup of each existing destination file
    -b    like --backup but does not accept an argument
    -i, --interactive
          prompt before overwrite
    --strip-trailing-slashes
          remove any trailing slashes from each SOURCE argument
    -S, --suffix=SUFFIX
          override the usual backup suffix
    -t, --target-directory=DIRECTORY
          move all SOURCE arguments into DIRECTORY
    -T, --no-target-directory
          treat DEST as a normal file
    -u, --update
          move only when the SOURCE file is newer than the
          destination file or when the destination file is missing
    -Z, --context
          set SELinux security context of destination file to
          default type

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using `npm test`.

## License

Copyright (c) 2023 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[renamer]: https://www.npmjs.com/package/renamer
[cat.js]: https://www.npmjs.com/package/@unixcompat/cat.js
[cp.js]: https://www.npmjs.com/package/@unixcompat/cp.js
[ln.js]: https://www.npmjs.com/package/@unixcompat/ln.js
[mkdir.js]: https://www.npmjs.com/package/@unixcompat/mkdir.js
[rm.js]: https://www.npmjs.com/package/@unixcompat/rm.js
[POSIX documentation]: https://man7.org/linux/man-pages/man1/mv.1p.html
[Linux implementation]: https://man7.org/linux/man-pages/man1/mv.1.html
[`rename`]: https://nodejs.org/api/fs.html#fscpsrc-dest-options-callback
[node:fs]: https://nodejs.org/api/fs.html
[BASH patterns]: https://www.linuxjournal.com/content/pattern-matching-bash
