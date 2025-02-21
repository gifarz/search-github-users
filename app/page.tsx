"use client"

import React from "react";
import styles from "@/styles/Layout.module.css";
import SearchIcon from "@/public/search.svg";
import SpotlightCard from "./components/Card";
import Modal from "./components/Modal";
import Home from "./components/Home";
import { useGithub } from "@/context/GithubContext";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string;
  followers?: string;
  following?: string;
  bio?: string;
  html_url: string;
  message?: string;
  public_repos?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
}

// This page is the main component that wrapped the components that existed in this repository
export default function page() {

  const [username, setUsername] = React.useState<string>("");
  const [userData, setUserData] = React.useState<GitHubUser | null>(null);
  const [userRepo, setUserRepo] = React.useState<GitHubRepo[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // useGithub function that used global state management and call the state of setUserGithub and setRepo for changing the each state
  const { setUserGithub, setRepo } = useGithub();

  // fetchUser function is fetching data of 2 apis there are /api/getUserGithub and /api/checkUserRepo
  const fetchUser = async () => {
    setError(null);
    setUserData(null);
    setUserRepo(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/getUserGithub?username=${username}`);
      if (!res.ok) {
        setIsLoading(false);
        throw new Error("User not found");
      }

      const data: GitHubUser = await res.json();

      if (data.message) {
        setIsLoading(false);
        throw new Error(data.message == "Not Found" ? "Github User Does Not Exist" : data.message);
      }

      setUserData(data);

      const repoRes = await fetch(`/api/checkUserRepo?username=${username}`);
      if (!repoRes.ok) {
        setIsLoading(false);
        throw new Error("Repositories not found");
      }

      let repoData: GitHubRepo[] = await repoRes.json();

      setIsLoading(false);
      setUserRepo(repoData);

    } catch (err) {
      setIsLoading(false);
      setError((err as Error).message);
    }
  };

  //openModal function for opening the modal when click the view readme button
  const openModal = (repo: GitHubRepo) => {
    setIsOpen(true)
    setRepo(repo.name)
    setUserGithub(username)
  }

  return (
    <>
      {
        isOpen ?
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        :
        null
      }

      <Home>
        <div className={styles["search-container"]}>
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchUser()
              }
            }}
          />
          <span
            className={styles["search-icon"]}
            onClick={fetchUser}
          >
            <SearchIcon />
          </span>
        </div>

        {
          isLoading ?
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
              <p className={styles.text}>Please Wait...</p>
            </div>
            :
            <>
              {
                error &&
                <div className={styles["text-center"]}>
                  <p className={styles["text-error"]}>{error}</p>
                </div>
              }

              {userData && (
                <SpotlightCard className={styles["profile-container"]} spotlightColor="rgba(0, 26, 255, 0.2)">
                  <img
                    src={userData.avatar_url}
                    alt={userData.login}
                  />
                  <div className={styles["profile-info"]}>
                    <h2>{userData.name || userData.login}</h2>
                    <p>{userData.bio}</p>
                    <p>Followers : {userData.followers}</p>
                    <p>Following : {userData.following}</p>
                    <a
                      href={userData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Profile
                    </a>
                  </div>
                </SpotlightCard>
              )}

              {userRepo && userRepo.length > 0 && (
                <div>
                  <h2 className={styles["text-center"]} style={{ margin: "50px 0" }}>
                    Total Repository : {userData?.public_repos}
                  </h2>
                  <div className={styles["grid-container"]}>
                    {userRepo.map((repo) => (
                      <SpotlightCard key={repo.id} spotlightColor="rgba(0, 26, 255, 0.2)">
                        <div className={styles["card-content"]}>
                          <h3>Project Name : {repo.name}</h3>
                          <div className={styles["card-button"]}>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles["button-show"]}
                            >
                              Show Repo
                            </a>
                            <button
                              className={styles["button-view"]}
                              onClick={() => openModal(repo)}>
                              View ReadMe
                            </button>
                          </div>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>
                </div>
              )}
            </>
        }
      </Home>
    </>
  );
}
