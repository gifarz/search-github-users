import React from "react";
import styles from "../../styles/Layout.module.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null; // Don't render when closed

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                {title && <h2 className={styles.title}>{title}</h2>}
                <div className={styles["modal-content"]}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
