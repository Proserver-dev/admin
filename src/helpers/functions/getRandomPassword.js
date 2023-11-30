const generateRandomCharacter = (characters) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
};

const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const specialCharacters = '!@#$%^&*()-_+=<>?';

const getRandomCharacters = (characters, count) => {
    let result = '';
    for (let i = 0; i < count; i++) {
        result += generateRandomCharacter(characters);
    }
    return result;
};

const getRandomPassword = () => {
    const passwordLength = 8;
    const requiredLowercase = generateRandomCharacter(lowercaseLetters);
    const requiredUppercase = generateRandomCharacter(uppercaseLetters);
    const requiredNumber = generateRandomCharacter(numbers);
    const requiredSpecial = generateRandomCharacter(specialCharacters);

    const remainingLength = passwordLength - 4;

    const randomLowercase = getRandomCharacters(lowercaseLetters, remainingLength);
    const randomUppercase = getRandomCharacters(uppercaseLetters, remainingLength);
    const randomNumber = getRandomCharacters(numbers, remainingLength);
    const randomSpecial = getRandomCharacters(specialCharacters, remainingLength);

    const combinedCharacters = requiredLowercase + requiredUppercase + requiredNumber + requiredSpecial +
        randomLowercase + randomUppercase + randomNumber + randomSpecial;

    return combinedCharacters.split('').sort(() => Math.random() - 0.5).join('');
};

export default getRandomPassword