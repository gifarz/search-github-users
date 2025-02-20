import React from "react";
import { ReactNode } from "react";
import styles from "../../styles/Layout.module.css";

interface HomeProps {
    children?: ReactNode;
}

const Home: React.FC<HomeProps> = ({ children }) => {
    const [scrolled, setScrolled] = React.useState<boolean>(false);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0.1) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
