import {setLogOut} from "./Auth";
import prepareSnackBarErrorObj from "./prepareSnackBarErrorObj";

const handleTokenExpiration = (errorMessage, setCurrentUser, setLoginToken, setSnackBar) => {
    setCurrentUser({});
    setLoginToken(null);
    setLogOut()
    setSnackBar(prepareSnackBarErrorObj({ message: errorMessage }));
};

export default handleTokenExpiration