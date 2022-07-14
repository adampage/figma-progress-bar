Progress Bar
===

Use this Figma and FigJam widget to display a progress for things that can be
expressed in integers.

Code organization:

| dir / path               | description                          |
| ------------------------ | ------------------------------------ |
| widget-src/              | This is where the widget code lives  |
| widget-src/code.tsx      | Main entry point for the widget code |
| widget-src/tsconfig.json | tsconfig for the widget code         |
| dist/                    | Built output goes here               |

- The widget code is built using esbuild to bundle widget-src/code.tsx into one
file.

## Build

1. Install the required dependencies with `npm ci`
2. Build the widget code with `npm run build`
3. In Figma, run “Import widget from manifest”
4. Choose the built `manifest.json`

## Develop

Build the widget in development development mode by running:

```sh
npm run dev
```

This command starts the follow in watch mode:
1. typechecking for widget-src
2. building for widget-src

While this command is running, any changes to `widget-src/code.tsx` will be
compiled into the `dist/code.js` file that is referenced by the manifest.json.

## Other scripts

| script                   | description                                      |
| ------------------------ | ------------------------------------------------ |
| npm run build            | one-off full build of the widget                 |
| npm run test             | typecheck the widget code                        |
