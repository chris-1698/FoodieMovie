import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, Typography } from "@material-ui/core";
import { TextField } from "@mui/material";
import { ClerkProvider } from "@clerk/clerk-react";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const UserLogin = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState();
    const { t } = useTranslation();

    const navigate = useNavigate();

    const onClickButton = () => {
        //TODO
    };

    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Box
                sx={{
                    width: "70%",
                    height: 800,
                    backgroundColor: "primary.main",
                }}
                borderRadius="3%"
                >
                <Grid pt={20} container justifyContent="center" alignItems="center">
                    <img
                    src="/src/assets/images/logo.png"
                    alt=""
                    style={{height: '100px', float: "left", marginRight: "10px" }}
                    />
                    <Typography component="h3" variant="h3">
                    {t("page_welcome_msg")}
                    </Typography>
                </Grid>

                <br />
                <Grid className="emailInput" container justifyContent="center">
                    <TextField
                    sx={{ width: 600 }}
                    value={email}
                    label={t("session.email")}
                    // onChange={(ev) => setEmail(ev.target.value)}
                    className="inputBox"
                    />
                    <label className="errorLabel">{emailError}</label>
                </Grid>

                <br />
                <Grid className="passwordInput" container justifyContent="center">
                <TextField
                    sx={{ width: 600 }}
                    type="password"
                    value={password}
                    label={t("session.password")}
                    // onChange={(ev) => setPassword(ev.target.value)}
                />    
                </Grid>
                
            
                <br />
                <Grid container justifyContent="center" alignContent="center">
                    <div className="buttonContainer">
                    <Button
                        className="inputButton"
                        onClick={onClickButton}
                        variant="contained"
                    >
                        {t("session.login")}
                    </Button>
                    </div>
                </Grid>
                </Box>
            </Grid>
        </>
    );
};

export default UserLogin;
