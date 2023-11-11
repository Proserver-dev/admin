const ApiResults = {
    ERR_LOGIN_ERROR: { message: "Błąd logowania", code: 'ERR_LOGIN_ERROR' },
    ERR_PROVIDE_LOGIN_DATA: { message: 'Musisz wprowadzić dane logowania', code: 'ERR_PROVIDE_LOGIN_DATA' },
    ERR_USER_NOT_EXISTS: { message: 'Taki użytkownik nie istnieje', code: 'ERR_USER_NOT_EXISTS' },
    // ERR_PROVIDE_DEVICE_TOKEN: { message: 'Musisz przekazać Device-Token w nagłówku', code: 'ERR_PROVIDE_DEVICE_TOKEN' },
    ERR_PROVIDE_DEVICE_TOKEN: { message: 'Nie masz do tego uprawnień', code: 'ERR_PROVIDE_DEVICE_TOKEN' },
    ERR_WRONG_PASSWORD: { message: 'Nieprawidłowe hasło', code: 'ERR_WRONG_PASSWORD' },
    ERR_TOKEN_EXPIRED: { message: 'Token logowania wygasł', code: 'ERR_TOKEN_EXPIRED' },
    ERR_REFRESH_TOKEN_EXPIRED: { message: 'Refresh-Token jest nieaktualny. Zaloguj się ponownie', code: 'ERR_REFRESH_TOKEN_EXPIRED' },
    ERR_GET_ROLES: { message: 'Wystąpił błąd podczas pobierania ról', code: 'ERR_GET_ROLES' },
    ERR_DELETE_ROLE: { message: 'Wystąpił błąd podczas usuwania roli', code: 'ERR_DELETE_ROLE:' },
    ERR_ROLE_NAME_IS_RESERVED: { message: 'Nie możesz dodać roli o tej nazwie', code: 'ERR_ROLE_NAME_IS_RESERVED' },
    ERR_ROLE_ALREADY_EXISTS: { message: 'Taka rola już istnieje', code: 'ERR_ROLE_ALREADY_EXISTS' },
    ERR_ROLE_EDIT_NAME_IS_RESERVED: { message: 'Nie możesz edytować tej roli, jest ona zablokowana', code: 'ERR_ROLE_EDIT_NAME_IS_RESERVED' },
    ERR_ROLE_EDIT_ALREADY_EXISTS: { message: 'Nie możesz zmienić nazwy roli na taką, taka już istnieje', code: 'ERR_ROLE_EDIT_ALREADY_EXISTS' },
    ERR_ROLE_DELETE_NAME_IS_RESERVED: { message: 'Nie możesz usunąć tej roli, jest ona zablokowana', code: 'ERR_ROLE_DELETE_NAME_IS_RESERVED' },
    ERR_PROVIDE_NAME_FIELD: { message: 'Musisz przekazać wartość pola "name"', code: 'ERR_PROVIDE_NAME_FIELD' },
}

export default ApiResults;