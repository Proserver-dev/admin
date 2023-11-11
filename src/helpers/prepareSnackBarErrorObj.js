import ApiResults from "../constants/ApiResults";

const prepareSnackBarErrorObj = (error) => {
    let message = "Wystąpił nieznany błąd"
    let code = "ERR_UNKNOWN"

    if (error.response && error.response.data.error) {
        if(ApiResults[error.response.data.error]) {
            message = ApiResults[error.response.data.error].message
        }
        code = error.response.data.error

        message += " | "+code
    } else {
        if (error.message)
            message = error.message

        if (error.code)
            message += " | " + error.code
    }

    return { type: 'error', message: message, show: true }
}

export default prepareSnackBarErrorObj