import { push, set } from "firebase/database";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const SpendingForm = ({ dbSpending, daysSince, setUserBalance, dbBalance, userBalance, daysUntil, setDaysSince, setDaysUntil }) => {
    // Form input onChange for the spending data will be stored in this state
    const [newSpendingData, setNewSpendingData] = useState({});
    // Tracks changes in the SpendingForm
    const spendingOnChange = (e) => {
        // Store the changes inside a variable
        const tempVal = e.target.value;
        setNewSpendingData({
            // Spreading whatever existing data is in newSpendingData
            ...newSpendingData,
            // Target the name attribute and use that as the property and pair it with the tempVal. Overwrites an existing value if the name matches to 'update' the value
            [e.target.name]: tempVal,
        });
        console.log(newSpendingData);
    };

    // Handles the submission behavior of the SpendingForm
    const spendingOnSubmit = (e) => {
        e.preventDefault();
        // Subtracts the userBalance by the expense cost
        const tempCalc = userBalance - parseInt(newSpendingData.expenseCost);
        // Update the state with tempCalc
        setUserBalance(tempCalc);
        // Set tempCalc into firebase. Set because it will overwrite the previous entry (Updating the balance)
        set(dbBalance, tempCalc);
        // Push the key value pair of the expense to the spending node. Push to get a new firebase key.
        push(dbSpending, { [newSpendingData.expenseName]: newSpendingData.expenseCost });
        // Resets the form
        e.target.reset();
    };

    const nextDay = () => {
        if (daysUntil === 0) {
            return;
        } else {
            setDaysSince(daysSince + 1);
            setDaysUntil(daysUntil - 1);
        }
    };

    const prevDay = () => {
        if (daysSince === 0) {
            return;
        } else {
            setDaysSince(daysSince - 1);
            setDaysUntil(daysUntil + 1);
        }
    };

    return (
        <>
            <section className="spendingAndButtons">
                <form onSubmit={spendingOnSubmit} className="spendingFormContainer">
                    <div>
                        <h3 className="dayCount">Current Day: {daysSince}</h3>
                        <h3 className="dayCount">Days until next pay: {daysUntil}</h3>
                    </div>
                    <input type="text" id="expenseName" name="expenseName" placeholder="Expense Name" required minLength="1" onChange={spendingOnChange} />
                    <input type="number" id="expenseCost" name="expenseCost" placeholder="Expense Cost" required minLength="1" onChange={spendingOnChange} />
                    <button type="submit" className="rectangleButton">
                        Submit Expense
                    </button>
                </form>
                <div className="dayButtonsContainer">
                    <button onClick={nextDay} className="dayButton">Next Day</button>
                    <button onClick={prevDay} className="dayButton">Previous Day</button>
                </div>
            </section>
            {/* if there is no userBalance after a hard refresh, return to Home */}
            {userBalance ? null : <Navigate to="/Home" />}
        </>
    );
};

export default SpendingForm;