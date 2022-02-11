const express = require('express')
const Gun = require('gun')
const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8765;

const app = express()
app.use(Gun.serve)

const server = app.listen(port, () => {
    console.log("Listening at: http://localhost://" + port)
})

Gun({web: server})