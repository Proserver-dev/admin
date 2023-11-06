const prepareSnackBarErrorObj = (error) => {
    let message = ""
    if(error.message)
        message = error.message

    if(error.code)
        message += " | "+error.code

    return { type: 'error', message: message, show: true }
}

export default prepareSnackBarErrorObj