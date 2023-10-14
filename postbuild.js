const glob = require('glob')
const fs = require('fs/promises')

// Generate the license file and write it to disk.
glob('./out/**/*.{html,js,css}', {}, (err, files) => {
    files.forEach(file => {
        if (file.endsWith('.html')) {
            fs.readFile(file).then(content => {
                let [before, after] = content.toString().split("</script><script>(self")
                if (!after) return
                after = after.toString().replace(/(\w|")\/(\w|_next)/g, (substring) => {
                    return substring.replace("/", "_")
                })
                files.forEach(filename => {
                    const match = filename.replace("./out", "")
                    const replace = `zapstream-utils-${match.replaceAll("/", "_")}`
                    after = after.toString().replaceAll(match, replace)
                    if (filename.endsWith('.js') && filename.match(/chunks\/(app\/|\d{3}-)/)) {
                        let [text1, text2] = after.split('</script></body>')
                        text1 = text1 + `</script><script type="text/javascript" src="${match}" async>`
                        after = [text1, text2].join("</script></body>")
                    }
                })
                fs.writeFile(file, [before, after].join("</script><script>(self"))
            })
        } else {
            fs.readFile(file).then(content => {
                let text = content.toString()
                text = text.replaceAll("/_next/", "zapstream-utils/zapstream-utils-__next_")
                files.forEach(filename => {
                    const match = filename.replace("./out", "")
                    const replace = `zapstream-utils-${match.replaceAll("/", "_")}`
                    text = text.toString().replaceAll(match, replace)
                })
                fs.writeFile(file, text)
            })
        }
    })
})
