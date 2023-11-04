export const isLogged = () => {
    return localStorage.getItem("app-login");
};

export const setLogIn = () => {
    localStorage.setItem("app-login", "zalogowany");
}

export const setLogOut = () => {
    localStorage.clear();
}