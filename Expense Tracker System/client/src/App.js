import React, { useEffect, useState } from "react";
import { Box, Card, Grid, CircularProgress } from "@mui/material";
import Item from "@mui/material/Grid";
import { Container } from "@mui/system";
import ExpenseForm from "./components/ExpenseForm";
import TransactionList from "./components/TransactionList";
import ExpenseTracker from "./components/ExpenseTracker";
import ResponsiveAppBar from "./components/layout/Appbar";
import { message } from "antd";
import CustomHttp from "./components/CustomHttp";
import axios from "axios";

function App() {
    const [allExpense, setAllExpense] = useState([]);
    const [wallet, setWallet] = useState({});
    const [incomes, setIncomes] = useState({});
    const [expenses, setExpenses] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchExpenseData = () => {
        return CustomHttp({
            url: "/getallexpense",
            headers: {
                "Content-Type": "application/json",
                timeout: 5000,
                usertoken: localStorage.getItem("token"),
            },
            method: "get",
        });
    };
    const fetchCategoriesTotal = () => {
        return CustomHttp({
            url: "/getallexpensetotal",
            headers: {
                "Content-Type": "application/json",
                timeout: 5000,
                usertoken: localStorage.getItem("token"),
            },
            method: "get",
        });
    };

    const addTransaction = (expenseData) => {
        CustomHttp({
            url: "/addExpense",
            headers: {
                "Content-Type": "application/json",
                timeout: 5000,
                usertoken: localStorage.getItem("token"),
            },
            method: "post",
            data: expenseData,
        }).then((res) => {
            if (res.status == 200) {
                if (expenseData.action == "expense") {
                    let newTotalExpense =
                        wallet.totalExpense +
                        Number.parseInt(expenseData.amount);
                    setWallet({ ...wallet, totalExpense: newTotalExpense });
                    setExpenses((prevState) => {
                        prevState[expenseData.category] =
                            prevState[expenseData.category] +
                            Number.parseInt(expenseData.amount);
                        return prevState;
                    });
                    message.success("Expense added successfully");
                } else {
                    let newTotalSavings =
                        wallet.totalSavings +
                        Number.parseInt(expenseData.amount);
                    setWallet({ ...wallet, totalSavings: newTotalSavings });
                    setIncomes((prevState) => {
                        prevState[expenseData.category] =
                            prevState[expenseData.category] +
                            Number.parseInt(expenseData.amount);
                        return prevState;
                    });
                    message.success("Savings added successfully");
                }
                setAllExpense([res.data.lastTransaction, ...allExpense]);
            }
        });
    };

    const fetchData = () => {
        axios
            .all([fetchExpenseData(), fetchCategoriesTotal()])
            .then(([resExpense, resCategories]) => {
                if (resExpense.status == 200) {
                    setAllExpense(resExpense.data.allUserExpense);
                    setWallet(resExpense.data.wallet);
                } else {
                    message.error("Something went wrong!");
                }
                if (resCategories.status == 200) {
                    setIncomes(resCategories.data.categoriesTotal.incomes);
                    setExpenses(resCategories.data.categoriesTotal.expenses);
                }
            })
            .then(() => {
                setLoading(false);
                // setStatus({ success: true });
                // setSubmitting(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div style={{ userSelect: "none" }}>
            <ResponsiveAppBar />
            <div style={{ marginTop: "10px" }}>
                <Container>
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: 300,
                                width: "100%",
                            }}
                        >
                            <CircularProgress color="secondary" />
                        </Box>
                    ) : (
                        <Grid container spacing={2} alignItems="center">
                            <Grid
                                item
                                xs={12}
                                md={3}
                                className="income-tracker"
                            >
                                <Item>
                                    <ExpenseTracker
                                        type="income"
                                        data={incomes}
                                        total={wallet.totalSavings}
                                    />
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6} className="main-tracker">
                                <Item>
                                    <Card>
                                        <ExpenseForm
                                            balance={
                                                wallet.totalSavings -
                                                wallet.totalExpense
                                            }
                                            loading={loading}
                                            addTransaction={addTransaction}
                                        />
                                        <Box
                                            sx={{
                                                width: "100%",
                                                height: 300,
                                                overflowY: "auto",
                                            }}
                                        >
                                            <TransactionList
                                                transactions={allExpense}
                                            />
                                        </Box>
                                    </Card>
                                </Item>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={3}
                                className="expense-tracker"
                            >
                                <Item>
                                    <ExpenseTracker
                                        type="expense"
                                        data={expenses}
                                        total={wallet.totalExpense}
                                    />
                                </Item>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default App;
