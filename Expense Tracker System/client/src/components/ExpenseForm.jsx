import React, { useState, useEffect } from "react";
import {
    CardContent,
    MenuItem,
    Select,
    Typography,
    FormControl,
    InputLabel,
    Grid,
    TextField,
    Button,
    Chip,
    Skeleton,
    Box,
    CircularProgress,
} from "@mui/material";
import CustomHttp from "./CustomHttp";

const initState = {
    action: "income",
    category: "",
    amount: 1,
};

function ExpenseForm({ balance, addTransaction }) {
    const [expenseData, setExpenseData] = useState(initState);
    const [categories, setCategories] = useState({});
    const fetchCategories = () => {
        CustomHttp({
            url: "/getallcategory",
            headers: {
                "Content-Type": "application/json",
                timeout: 5000,
                usertoken: localStorage.getItem("token"),
            },
            method: "get",
        }).then((resCategory) => {
            if (resCategory.status == 200) {
                setCategories(resCategory.data.categories[0]);
            } else {
                // message.error("Something went wrong!");
            }
        });
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const onInputChange = (evt) => {
        setExpenseData({ ...expenseData, [evt.target.name]: evt.target.value });
    };

    const onFormSubmit = (evt) => {
        evt.preventDefault();
        addTransaction(expenseData);
    };
    let cats =
        expenseData.action == "expense"
            ? categories.expenses || []
            : categories.savings || [];

    return (
        <>
            <CardContent
                style={{
                    backgroundColor:
                        expenseData.action == "expense" ? "#fcc7c0" : "#99f7ae",
                }}
            >
                <Typography variant="h5" component="h3" align="center">
                    <Chip label={`Balance ${balance}$`} />
                </Typography>
                <Typography variant="h6" component="h6" my={3}></Typography>
                <form onSubmit={onFormSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} my={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="expense-type-label-id">
                                    Type
                                </InputLabel>
                                <Select
                                    labelId="expense-type-label-id"
                                    required
                                    value={expenseData.action}
                                    label="type"
                                    name="action"
                                    onChange={onInputChange}
                                >
                                    <MenuItem value="expense">expense</MenuItem>
                                    <MenuItem value="income">income</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} my={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="category-select-id">
                                    Category
                                </InputLabel>
                                <Select
                                    labelId="category-select-id"
                                    value={expenseData.category}
                                    label="Category"
                                    required
                                    name="category"
                                    onChange={onInputChange}
                                >
                                    {cats.map((cty, index) => (
                                        <MenuItem value={cty} key={index}>
                                            {cty}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} my={2}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                required
                                label="Amount"
                                name="amount"
                                value={expenseData.amount}
                                onChange={onInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} mb={4}>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={{
                                backgroundColor: "#9C27B0",
                                "&:hover": { backgroundColor: "#9C27B0" },
                            }}
                        >
                            Save
                        </Button>
                    </Grid>
                </form>
            </CardContent>
        </>
    );
}

export default ExpenseForm;
