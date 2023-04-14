import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import color from "../assets/color.json";

function ExpenseTracker(props) {
    console.log(Object.values(props.data));
    console.log(Object.keys(props.data));
    const { type = "income" } = props;
    const colors =
        props.type == "expense" ? color.expenseColors : color.incomeColors;
    console.log(colors.slice(0, 4));
    const { total, chartData } = {
        total: 0,
        chartData: {
            labels: Object.keys(props.data),
            datasets: [
                {
                    label: "$ Amount",
                    data: Object.values(props.data),
                    backgroundColor: colors.slice(0, 4),
                    borderWidth: 1,
                },
            ],
        },
    };
    const col = type === "income" ? "green" : "red";

    return (
        <Card raised={true} sx={{ border: `1px solid ${col}` }}>
            <CardContent>
                <Typography
                    variant="h4"
                    component="h1"
                    style={{ textAlign: "center", color: col }}
                >
                    {type.toUpperCase()}
                </Typography>
                <Typography variant="h5" align="center" component="h2">
                    {props.total}{" "}
                    <Typography variant="h5" component="span" color={col}>
                        $
                    </Typography>
                </Typography>
                <Doughnut data={chartData} />
            </CardContent>
        </Card>
    );
}

export default ExpenseTracker;
