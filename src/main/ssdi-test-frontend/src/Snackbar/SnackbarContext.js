import React, {createContext, useContext, useState} from "react";
import {Snackbar} from "@material-ui/core";

const SnackbarContext = createContext();

export function useSnackbar() {
    return useContext(SnackbarContext);
}

export function SnackbarProvider({children}) {
    const [snackbar, setSnackbar] = useState(null);

    const showSnackbar = (message, options = {}) => {
        setSnackbar({message, options});
    };

    const hideSnackbar = () => {
        setSnackbar(null);
    };

    return (
        <SnackbarContext.Provider value={{showSnackbar, hideSnackbar}}>
            {children}
            {snackbar && (
                <Snackbar
                    open={true}
                    autoHideDuration={snackbar.options.autoHideDuration || 3000}
                    onClose={hideSnackbar}
                    message={snackbar.message}
                    action={snackbar.options.action}
                />
            )}
        </SnackbarContext.Provider>
    );
}