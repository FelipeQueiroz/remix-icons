require("dotenv").config();
const svgo = require('@figma-export/transform-svg-with-svgo')


const capitalize = (s) => s.split("-").map(m => m.charAt(0).toUpperCase() + m.slice(1)).join("")
const fileId = process.env.FILE_ID;

const outputters = [
    require("@figma-export/output-components-as-svg")({ output: "./" }),
    require("@figma-export/output-components-as-svgr")({
        getFileExtension: () => ".tsx",
        getComponentName: ({ componentName }) => capitalize(componentName),
        getSvgrConfig: () => ({ typescript: true, exportType: "default"  }),
        output: "./src",
        getExportTemplate: ({ componentName, pageName }) => {
            return `export { default as ${capitalize(componentName)} } from './${capitalize(componentName)}';`;
        },
      }),
];

/** @type {import('svgo').PluginConfig[]} */
const solidSVGOConfig = [
  { removeDimensions: true },
  { sortAttrs: true },
  { removeAttrs: { attrs: "fill" } },
  { addAttributesToSVGElement: { attribute: { fill: "currentColor" } } },
];


/** @type {import('@figma-export/types').FigmaExportRC} */
module.exports = {
  commands: [
    ["components", {
        fileId,
        onlyFromPages: ["icons"],
        transformers: [svgo({ multipass: true, plugins:  [{name: 'preset-default', params: {attrs: 'path:fill'} }] })],
        outputters,
      },
    ],
  ],
};