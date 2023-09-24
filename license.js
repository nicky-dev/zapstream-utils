const { generateLicenseFile } = require('generate-license-file')

// Generate the license file and write it to disk.
generateLicenseFile('./package.json', './third-party-licenses.txt')
