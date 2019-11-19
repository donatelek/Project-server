exports.respondWithError = (res, error) => {
    res.status(400)
    res.json({
        error
    })

}

exports.respondNotFound = (res, error) => {
    res.status(404)
    res.send('not found')
}