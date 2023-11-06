const ApiResults = {
    ERR_LOGIN_ERROR: { message: "Błąd logowania", code: 'ERR_LOGIN_ERROR' },
    ERR_PROVIDE_LOGIN_DATA: { message: 'Musisz wprowadzić dane logowania', code: 'ERR_PROVIDE_LOGIN_DATA' },
    ERR_USER_NOT_EXISTS: { message: 'Taki użytkownik nie istnieje', code: 'ERR_USER_NOT_EXISTS' },
    // ERR_PROVIDE_DEVICE_TOKEN: { message: 'Musisz przekazać Device-Token w nagłówku', code: 'ERR_PROVIDE_DEVICE_TOKEN' },
    ERR_PROVIDE_DEVICE_TOKEN: { message: 'Nie masz do tego uprawnień', code: 'ERR_PROVIDE_DEVICE_TOKEN' },
    ERR_WRONG_PASSWORD: { message: 'Nieprawidłowe hasło', code: 'ERR_WRONG_PASSWORD' },
    ERR_TOKEN_EXPIRED: { message: 'Token logowania wygasł', code: 'ERR_TOKEN_EXPIRED' },
    ERR_REFRESH_TOKEN_EXPIRED: { message: 'Refresh-Token jest nieaktualny', code: 'ERR_REFRESH_TOKEN_EXPIRED' }
}

export default ApiResults;