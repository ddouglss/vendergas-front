import React from 'react';
import { X } from 'lucide-react';
import './ConfirmationDialog.css';

export default function ConfirmationDialog({
                                               message,
                                               onConfirm,
                                               onCancel,
                                               confirmButtonText = 'Confirmar',
                                               cancelButtonText = 'Cancelar',
                                               confirmButtonClass = 'btn-confirm',
                                               cancelButtonClass = 'btn-cancel'
                                           }) {
    return (
        <div className="confirmation-overlay">
            <div className="confirmation-dialog">
                <button onClick={onCancel} className="dialog-close-btn" title="Fechar">
                    <X size={20} />
                </button>
                <p>{message}</p>
                <div className="dialog-actions">
                    <button onClick={onCancel} className={cancelButtonClass}>
                        {cancelButtonText}
                    </button>
                    <button onClick={onConfirm} className={confirmButtonClass}>
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}