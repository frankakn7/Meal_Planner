import React from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import classes from "./Confirmation.module.css";

const Confirmation = (props) => {
    return (
        <Modal onClose={props.onCancel}>
            <div className={classes.main}>
                <div className={classes.title}>
                    <h1>Are you sure?</h1>
                </div>
                <div className={classes.message}>
                    <p>{props.message}</p>
                </div>
                <div className={classes.actions}>
                    <div>
                        <Button classes={classes.redButton} onClick={props.onCancel}>
                            No
                        </Button>
                    </div>
                    <div>
                        <Button classes={classes.greenButton} onClick={props.onContinue}>
                            Yes
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Confirmation;
