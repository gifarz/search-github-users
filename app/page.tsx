"use client"

import Home from "./components/Home";
import React from "react";
import styles from "../styles/Layout.module.css";
import SearchIcon from "@/public/search.svg";
import SpotlightCard from "./components/Card";
import Modal from "./components/Modal";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string;
  followers?: string;
  following?: string;
  bio?: string;
  html_url: string;
  message?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  readme?: string;
}

export default function App() {

  const [username, setUsername] = React.useState<string>("");
  const [repoName, setRepoName] = React.useState<string>("");
  const [repoReadMe, setRepoReadMe] = React.useState<string>("");
  const [userData, setUserData] = React.useState<GitHubUser | null>(null);
  const [userRepo, setUserRepo] = React.useState<GitHubRepo[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

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
        throw new Error(data.message == "Not Found" ? "Github User Does Not Exist" :  data.message);
      }

      setUserData(data);

      console.log("data getUser", data)

      const repoRes = await fetch(`/api/checkUserRepo?username=${username}`);
      if (!repoRes.ok) {
        setIsLoading(false);
        throw new Error("Repositories not found");
      }

      console.log("data repoRes", repoRes)

      let repoData: GitHubRepo[] = await repoRes.json();

      repoData = await Promise.all(
        repoData.map(async (repo) => {
          try {
            const readmeRes = await fetch(`/api/getReadMeRepo?username=${username}&repo=${repo.name}`);
            if (readmeRes.ok) {
              repo.readme = await readmeRes.text();
            }
          } catch {
            repo.readme = "No README available";
          }
          return repo;
        })
      );

      console.log("data repoData", repoData)

      setIsLoading(false);
      setUserRepo(repoData);

    } catch (err) {
      setIsLoading(false);
      setError((err as Error).message);
    }
  };

  const modalDetail = (repo: GitHubRepo) => {
    setIsOpen(true)
    setRepoName(repo.name)
    setRepoReadMe(repo.readme || "No README available")
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={repoName}>
        <p>{repoReadMe}</p>
      </Modal>

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
                  <h3 className={styles["text-center"]} style={{ margin: "50px 0" }}>List of Repositories</h3>
                  <div className={styles["grid-container"]}>
                    {userRepo.map((repo) => (
                      <SpotlightCard key={repo.id} spotlightColor="rgba(0, 26, 255, 0.2)">
                        <div className={styles["card-content"]}>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Project Name : {repo.name}
                          </a>

                          <p className={styles["limit-text"]}>
                            ReadMe : {repo.readme || "No README available"}
                          </p>

                          <button className={styles.button} onClick={() => modalDetail(repo)}>View ReadMe</button>
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
