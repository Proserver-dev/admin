// Sprawdza, czy hasło ma przynajmniej określoną ilość znaków
const isPasswordLengthValid = (password, minLength) => password.length >= minLength;

// Sprawdza, czy hasło zawiera dokładnie określoną ilość małych liter
const hasLowercases = (password, count) => {
    const lowercaseMatches = password.match(/[a-z]/g) || [];
    return lowercaseMatches && lowercaseMatches.length >= count;
};

// Sprawdza, czy hasło zawiera dokładnie określoną ilość wielkich liter
const hasUppercases = (password, count) => {
    const uppercaseMatches = password.match(/[A-Z]/g) || [];
    return uppercaseMatches && uppercaseMatches.length >= count;
};

// Sprawdza, czy hasło zawiera dokładnie określoną ilość cyfr
const hasNumbers = (password, count) => {
    const digitMatches = password.match(/[0-9]/);
    return digitMatches && digitMatches.length >= count;
};

// Sprawdza, czy hasło zawiera dokładnie określoną ilość znaków specjalnych
const hasSpecialCharacters = (password, count) => {
    const specialMatches = password.match(/[^\w\d]/g) || [];
    return specialMatches && specialMatches.length >= count;
};

export { isPasswordLengthValid, hasLowercases, hasUppercases, hasNumbers, hasSpecialCharacters }