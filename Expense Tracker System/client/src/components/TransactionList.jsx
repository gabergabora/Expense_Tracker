import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Slide,
    Typography,
} from "@mui/material";
import React from "react";
import { MdOutlineDelete } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { FaInbox } from "react-icons/fa";

function TransactionList({ transactions }) {
    const RenderTransactionList = () => {
        const items = transactions.map((transaction) => (
            <Slide
                direction="down"
                in
                mountOnEnter
                unmountOnExit
                key={transaction.createdAt}
            >
                <ListItem>
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                bgcolor:
                                    transaction.action === "income"
                                        ? "#00e676"
                                        : "#ff1744",
                                color: "rgb(255, 255, 255)",
                            }}
                        >
                            <GrMoney style={{ fill: "currentColor" }} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={transaction.category}
                        secondary={`$${transaction.amount}`}
                    />
                    <ListItemSecondaryAction>
                        {transaction.action}
                        {/* <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {}}
                        >
                            <MdOutlineDelete />
                        </IconButton> */}
                    </ListItemSecondaryAction>
                </ListItem>
            </Slide>
        ));
        return <List dense={false}>{items}</List>;
    };

    const NoTransaction = () => {
        return (
            <div
                style={{
                    height: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    color: "#ddd",
                }}
            >
                <div style={{ textAlign: "center", width: "100%" }}>
                    <FaInbox
                        style={{
                            fontSize: "50px",
                            display: "block",
                            margin: "auto",
                        }}
                    />
                    <Typography variant="h6" component="span">
                        No Transactions Yet
                    </Typography>
                </div>
            </div>
        );
    };

    return (
        <div>
            {transactions.length > 0 ? (
                <RenderTransactionList />
            ) : (
                <NoTransaction />
            )}
        </div>
    );
}

export default TransactionList;
