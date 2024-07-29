// import { Request, Response, NextFunction } from 'express'
// import dns from 'dns'

const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+([a-z]{2,63})|' + // validate domain name with TLD (2-63 characters)
    '((\\d{1,3}\\.){3}\\d{1,3})|' + // validate OR ip (v4) address
    '\\[([a-f0-9:]+)\\])' + // validate OR ipv6 address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i' // validate fragment locator
);

// Setting options for dns.lookup() method
const options = {
    all: true,
}

const error = { error: 'invalid url' }

exports.UrlMiddleware = async(req, res, next) => {
    // validate url schema first
    if (pattern.test(req.body.url)) {
        next()
        // dns.lookup(req.body.url, options, function (err) {
        //     if (err) {
        //         res.json(error)
        //     } else {
        //     }
        // })
    } else {
        res.json(error)
    }
}
