"use client"
import { PaymentOption } from "@/types/client/types";
import React, { useState } from "react";


type Props = {
    selectedOption: PaymentOption;
    setSelectedOption: (option: PaymentOption) => void;
};

const PaymentOptions = (props: Props) => {

    const handleOptionChange = (option: PaymentOption) => {
        props.setSelectedOption(option);
    };

    return (
        <div>
            <h2>Select Payment Option</h2>
            <div>
                <input
                    type="radio"
                    id="COD"
                    value="COD"
                    checked={props.selectedOption === "COD"}
                    onChange={() => handleOptionChange("COD")}
                />
                <label htmlFor="COD">Cash on Delivery (COD)</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="UPI"
                    value="UPI"
                    checked={props.selectedOption === "UPI"}
                    onChange={() => handleOptionChange("UPI")}
                    disabled // Disabling UPI
                />
                <label htmlFor="UPI">UPI</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="Card"
                    value="Card"
                    checked={props.selectedOption === "Card"}
                    onChange={() => handleOptionChange("Card")}
                    disabled // Disabling Card
                />
                <label htmlFor="Card">Debit/Credit Card</label>
            </div>
        </div>
    );
};

export default PaymentOptions;
