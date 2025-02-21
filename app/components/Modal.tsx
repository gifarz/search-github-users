import React from "react";
import styles from "@/styles/Layout.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useGithub } from "@/context/GithubContext";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    username?: string;
}

// Modal function for opening the modal when view readme clicked
const Modal: React.FC<ModalProps> = ({ onClose }) => {

    const [readMe, setReadMe] = React.useState<string | null>(null)

    // useGithub function that used global state management and call the state of userGithub and repo
    const { userGithub, repo } = useGithub()

    React.useEffect(() => {
        fetchReadMe()
    }, [])

    // fetchReadMe function for retrieving the readme of repository by github username 
    const fetchReadMe = async () => {
        try {
            const readmeRes = await fetch(`/api/getReadMeRepo?username=${userGithub}&repo=${repo}`);

            if (!readmeRes.ok) {
                setReadMe("No README available");
            }

            const response = await readmeRes.json()

            const content = decodeBase64Content(response.content)

            if (content == "") {
                setReadMe("No README available")
            } else {
                setReadMe(content)
            }

        } catch {
            setReadMe("No README available");
        }
    }

    // Function for decoding the content of readme in base64
    const decodeBase64Content = (encoded: string): string => {
        try {
            if (encoded) {
                return atob(encoded);
            }
            return ""
        } catch (error) {
            console.error("Invalid Base64 string", error);
            return "";
        }
    };


    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                {repo && <h2 className={styles.title}>{repo}</h2>}
                <div className={styles["prose"]}>
                    {
                        readMe ?
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {readMe}
                        </ReactMarkdown>
                        :
                        <p className={styles["text-center"]}>Loading...</p>
                    }
                </div>
            </div>
        </div>
    );
};

export default Modal;
