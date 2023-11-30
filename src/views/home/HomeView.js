import React, {useEffect} from 'react';
import {Button, Card, CardContent, Container, Grid, Paper, Skeleton, Stack, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {format} from "date-fns";
import Settings from "../../constants/Settings";
import swaggerLogo from "../../assets/other/swagger.png";
import jiraLogo from "../../assets/other/jira.png";

const HomeView = () => {
    const {t, i18n} = useTranslation();
    const currentUser = useSelector((state) => state.currentUser);

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_HOME")}
                </Typography>
            </Stack>

            <Grid container spacing={3}>
                {/* Card 1: User Info */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {t("APP_LOGGED_AS")}
                            </Typography>
                            {currentUser ? (
                                <>
                                    <Typography variant="caption" paragraph={true}
                                                style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_ID")}</strong>: {currentUser.id}
                                    </Typography>
                                    <Typography variant="caption" paragraph={true}
                                                style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_EMAIL")}</strong>: {currentUser.email}
                                    </Typography>
                                    <Typography variant="caption" paragraph={true}
                                                style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_USER_NAME")}</strong>: {currentUser.userName}
                                    </Typography>
                                    <Typography variant="caption" paragraph={true}
                                                style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_NAME_LASTNAME")}</strong>: {currentUser.nameLastname}
                                    </Typography>
                                    <Typography variant="caption" paragraph={true}
                                                style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_ROLE")}</strong>: {currentUser.role?.name} ({currentUser.role?.short})</Typography>
                                    <Typography variant="caption" paragraph={true}
                                                style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_UPDATED_AT")}</strong>: {format(new Date(currentUser.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                                    </Typography>
                                    <Typography variant="caption" paragraph={true}
                                                style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_CREATED_AT")}</strong>: {format(new Date(currentUser.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                                    </Typography>
                                </>
                            ) : (
                                <Skeleton animation="wave" height={40}/>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Placeholder Card 2 */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Skeleton animation="wave" height={90}/>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Placeholder Card 3 */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Skeleton animation="wave" height={90}/>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Placeholder Card 4 */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Skeleton animation="wave" height={90}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_INTERNAL_NOTES")}
                </Typography>
            </Stack>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={1} style={{padding: 15, marginBottom: 20, display: 'flex', alignItems: 'center'}}>
                        <img src={swaggerLogo} alt="Swagger Logo" style={{width: 25, marginRight: 15}}/>
                        <Typography variant="caption" style={{marginBottom: 0}}>
                            Dokumentacja Swaggera: <a href={Settings.API + "/api-docs"} target="_blank"
                                                      rel="noopener noreferrer">{Settings.API}/api-docs</a>
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={1} style={{padding: 15, marginBottom: 20, display: 'flex', alignItems: 'center'}}>
                        <img src={jiraLogo} alt="Jira Logo" style={{width: 25, marginRight: 15}}/>
                        <Typography variant="caption" style={{marginBottom: 0}}>
                            Jira: <a href="https://rideclub.atlassian.net" target="_blank"
                                     rel="noopener noreferrer">https://rideclub.atlassian.net</a>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default HomeView;
