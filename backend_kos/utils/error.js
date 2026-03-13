function throwError(message, status = 400, code = "VALIDATION_ERROR") {
    const error = new Error(message)
    error.status = status
    error.code = code
    throw error
}

module.exports = {
    throwError
}