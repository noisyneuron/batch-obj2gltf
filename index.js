#!/usr/bin/env node

const obj2gltf = require('obj2gltf')
const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv



function convert(inputDir, outputDir, file) {
  const input = path.resolve(inputDir, file)
  const output = path.resolve(outputDir, file.replace('.obj', '.gltf'))
  console.log(`converting ${input}`)
  return obj2gltf(input, { separate: true, outputDirectory: outputDir })
    .then(function (gltf) {
      const data = Buffer.from(JSON.stringify(gltf));
      fs.writeFileSync(output, data);
    })
    .catch(error => console.log(error))
}

async function main() {
  if (argv.input && argv.output) {
    const inputDir = path.resolve(__dirname, argv.input)
    const outputDir = path.resolve(__dirname, argv.output)
    const files = fs.readdirSync(inputDir).filter(e => e.match(/.*\.(obj)$/ig))

    if (files.length === 0) {
      console.log(`no .obj files in ${inputDir} ... BYE`)
      process.exit(1)
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    for (const file of files) {
      await convert(inputDir, outputDir, file)
    }

  } else {
    console.log('gimme input and output directories yo')
  }
}

main()
