require("dotenv").config();
const svgo = require('@figma-export/transform-svg-with-svgo')


const capitalize = (s) => s.split("-").map(m => m.charAt(0).toUpperCase() + m.slice(1)).join("")
const fileId = process.env.FILE_ID;

const outputters = [
    require("@figma-export/output-components-as-svg")({ output: "./" }),
    require("@figma-export/output-components-as-svgr")({
        getFileExtension: () => ".tsx",
        getComponentName: ({ componentName }) => capitalize(componentName),
        getSvgrConfig: () => ({ typescript: true, exportType: "default", expandProps: "start", replaceAttrValues: { "#121212":"{props.color}" } }),
        output: "./src",
        getExportTemplate: ({ componentName, pageName }) => {
            return `export { default as ${capitalize(componentName)} } from './${capitalize(componentName)}';`;
        },
      }),
];



/** @type {import('@figma-export/types').FigmaExportRC} */
module.exports = {
  commands: [
    ["components", {
        fileId,
        onlyFromPages: ["icons"],
        transformers: [svgo({ multipass: true, plugins:  [
          // You can enable a plugin with just its name.
          'sortAttrs',
          {
            name: 'convertColors',
            active: true,
            params: {}
          },
          'convertStyleToAttrs',
          {
            name: 'removeViewBox',
            // Disable a plugin by setting active to false.
            active: true,
          },
          {
            name: 'removeUnknownsAndDefaults',
            // Disable a plugin by setting active to false.
            active: true,
          },
          {
            name: 'cleanupIDs',
            // Add plugin options.
            params: {
              minify: true,
            }
          },
          
        ] })],
        outputters,
      },
    ],
  ],
};