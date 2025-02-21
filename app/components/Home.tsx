import React from "react";
import { ReactNode } from "react";
import styles from "@/styles/Layout.module.css";

interface HomeProps {
    children?: ReactNode;
}

// Home function for wrapping the component of navbar, content and footer
const Home: React.FC<HomeProps> = ({ children }) => {

    return (
        <div className={styles.container}>
            <nav className={`${styles.navbar}`}>
                <h1>GitHub User Search</h1>
            </nav>

            <main className={styles.content}>{children}</main>

            <footer className={styles.footer}>
                <p>&copy; 2025 Technical Test D3Labs</p>
            </footer>
        </div>
    );
};

export default Home;
