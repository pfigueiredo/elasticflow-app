import { Dialog, Button, Classes } from "@blueprintjs/core"
import { useCustomEventListener } from "react-custom-events";
import { useState } from "react";

export const ConfirmDialog = (props) => {

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({ icon: "confirm", title: "Confirm?" });
    const [callbackInfo, setCallbackInfo] = useState({ callback: null });

    const handleClose = (e) => {
        setIsOpen(false);
    }

    useCustomEventListener('editor:confirm', data => {
        setIsOpen(true);

        const dialogProps = {};
        dialogProps.icon = data.dialogProps?.icon ?? "confirm";
        dialogProps.title = data.dialogProps?.title ?? "Confirm?";
        dialogProps.message = data.dialogProps?.message ?? "Confirm the action performed?";
        dialogProps.cancelButtonName = data.dialogProps?.cancelButtonName ?? "Cancel";
        dialogProps.confirmButtonName = data.dialogProps?.confirmButtonName ?? "Confirm";
        dialogProps.cancelButtonIcon = data.dialogProps?.cancelButtonIcon ?? "cancel";
        dialogProps.confirmButtonIcon = data.dialogProps?.confirmButtonIcon ?? "confirm";
        dialogProps.confirmButtonIntent = data.dialogProps?.confirmButtonIntent ?? "success";

        setDialogProps(dialogProps);
        setCallbackInfo({ callback: data.callback });
    });

    const handleCancelButtonClick = (e) => {
        if (callbackInfo && callbackInfo.callback)
            callbackInfo.callback({ dialogResult: "cancel" });
        setIsOpen(false);
    }

    const handleConfirmButtonClick = (e) => {
        if (callbackInfo && callbackInfo.callback)
            callbackInfo.callback({ dialogResult: "confirm" });
        setIsOpen(false);
    }

    return (
        <Dialog icon={dialogProps.icon} title={dialogProps.title} {...props} isOpen={isOpen} onClose={handleClose}>
            <div className={Classes.DIALOG_BODY}>
                <span>{dialogProps.message}</span>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button icon="cancel" onClick={handleCancelButtonClick}>{dialogProps.cancelButtonName}</Button>
                    <Button icon="confirm" intent={dialogProps.confirmButtonIntent} onClick={handleConfirmButtonClick}>{dialogProps.confirmButtonName}</Button>
                </div>
            </div>
        </Dialog>
    )

}

