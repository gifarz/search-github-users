"use client"

import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface GithubContextType {
    repo: string;
    setRepo: (name: string) => void;
    userGithub: string;
    setUserGithub: (name: string) => void;
}

// Create the context
const GithubContext = createContext<GithubContextType | undefined>(undefined);

// Provider component
export const GithubProvider = ({ children }: { children: ReactNode }) => {
    const [repo, setRepo] = useState<string>("");
    const [userGithub, setUserGithub] = useState<string>("");

    return (
        <GithubContext.Provider value={{ repo, setRepo, userGithub, setUserGithub }}>
            {children}
        </GithubContext.Provider>
    );
};

export const useGithub = () => {
    const context = useContext(GithubContext);
    if (!context) {
        throw new Error("useGithub must be used within a GithubProvider");
    }
    return context;
};