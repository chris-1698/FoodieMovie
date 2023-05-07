import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, Typography } from "@material-ui/core";
import { TextField } from "@mui/material";
import { ClerkProvider } from "@clerk/clerk-react";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

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
                        width: '70%',
                        height: 800,
                        backgroundColor: "gray",
                    }}
                >
                    <Grid
                        pt={30}
                        className="inputContainer" 
                        container
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography component="h1" variant="h1">
                            {t('page_welcome_msg')}
                        </Typography>
                            <TextField
                                sx={{ width : 600 }}
                                value={email}
                                placeholder={t('session.email')}
                                // onChange={(ev) => setEmail(ev.target.value)}
                                className="inputBox"
                            />
                            <label className="errorLabel">{emailError}</label>
                    </Grid>
                    <br />
                    <Grid 
                        className="inputContainer" 
                        container
                        justifyContent="center"
                        alignContent="center"
                    >
                        <TextField
                            sx={{ width : 600 }}
                            type="password"
                            value={password}
                            placeholder={t('session.password')}
                            // onChange={(ev) => setPassword(ev.target.value)}
                        />
                    </Grid>
                    <br />
                    <Grid 
                        container 
                        justifyContent="center"
                        alignContent="center"  
                    >
                        <div className="buttonContainer">
                            <Button
                                className="inputButton"
                                onClick={onClickButton}
                                variant="contained"
                            >
                            {t('session.login')}
                            </Button>
                        </div>
                    </Grid>
                </Box>
            </Grid>
        </>

    // <div className="Login">
    // <TextField onSubmit={handleSubmit}>
    //     <Form.Group size="lg" controlId="email">
    //     <Form.Label>Email</Form.Label>

    //     <Form.Control
    //         autoFocus
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //     />
    //     </Form.Group>

    //     <Form.Group size="lg" controlId="password">
    //     <Form.Label>Password</Form.Label>

    //     <Form.Control
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //     />
    //     </Form.Group>

    //     <Button block size="lg" type="submit" disabled={!validateForm()}>
    //     Login
    //     </Button>
    // </Form>
    // </div>
  );
};

export default UserLogin;
