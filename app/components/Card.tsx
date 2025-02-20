import { useRef, ReactNode } from "react";
import styles from "../../styles/Layout.module.css";

interface HomeProps {
    children?: ReactNode;
    className?: string;
    spotlightColor?: string;
}

const SpotlightCard: React.FC<HomeProps> = ({ children, className = "", spotlightColor = "rgba(255, 255, 255, 0.25)" }) => {
    const divRef = useRef<any | null>(null);

    const handleMouseMove = (e:any) => {
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        divRef.current.style.setProperty("--mouse-x", `${x}px`);
        divRef.current.style.setProperty("--mouse-y", `${y}px`);
        divRef.current.style.setProperty("--spotlight-color", spotlightColor);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            className={`${styles["card-spotlight"]} ${className}`}
        >
            {children}
        </div>
    );
};

export default SpotlightCard;
