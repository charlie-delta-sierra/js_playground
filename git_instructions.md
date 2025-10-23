# 🚀 Git Workflow: Development and Release (Dev ➡️ Main)

This guide outlines a 4-step process for developing on an isolated branch (`dev`) and promoting stable, functional code to the production branch (`main`).

## 1. Initial Setup and Preparation

This setup is typically performed only once at the beginning of the project to establish the development branch.

| # | Action | Command | Explanation |
| :--- | :--- | :--- | :--- |
| **1.1** | Switch to `main` | `git checkout main` | Ensures your starting point is the stable version. |
| **1.2** | Pull Remote Changes | `git pull origin main` | Syncs your local `main` with the latest version from the server. |
| **1.3** | Create `dev` Branch | `git branch dev` | Creates the development branch based on `main`. |
| **1.4** | Push `dev` (Optional) | `git push -u origin dev` | Publishes the `dev` branch to the remote repository for backup. |

---

## 2. Development Cycle (The `dev` Branch)

Use this branch for all new features or bug fixes. You will repeat steps 2.2 through 2.4 continuously until a version is stable.

| # | Action | Command | Explanation |
| :--- | :--- | :--- | :--- |
| **2.1** | Switch to `dev` | `git checkout dev` | Move into your working environment. |
| **2.2** | Stage Changes | `git add .` | Prepares all modified or new files for commit. |
| **2.3** | Commit Changes | `git commit -m "Implement feature X for the next release"` | Records the current state of the code with a clear message. |
| **2.4** | Sync (Backup) | `git push origin dev` | Pushes your latest progress to the remote server. |

---

## 3. Releasing the Functional Version (Merge to `main`)

Once the code in `dev` is **stable and fully tested**, it's time to promote it to the stable release branch.

| # | Action | Command | Explanation |
| :--- | :--- | :--- | :--- |
| **3.1** | Switch to `main` | `git checkout main` | You must be on the branch that receives the changes. |
| **3.2** | Ensure `main` is Up-to-date | `git pull origin main` | Prevents conflicts by ensuring the local `main` is current. |
| **3.3** | **PERFORM THE MERGE** | `git merge dev` | Applies all commits from `dev` onto `main`. |
| **3.4** | *Resolve Conflicts*** | `git add .` then `git commit` | *If conflicts arise, fix them in your editor, stage the fixes, and complete the merge commit.* |
| **3.5** | Publish Release | `git push origin main` | Sends the new, stable version to the remote server. |

**\*Note:** In a team setting, step 3.3 is usually replaced by creating a **Pull Request (PR)** on a platform like GitHub before the merge is approved.

---

## 4. Return to Development

After the release, the `dev` branch must be updated with the new `main` state to ensure the next development cycle starts from the most stable foundation.

| # | Action | Command | Explanation |
| :--- | :--- | :--- | :--- |
| **4.1** | Switch back to `dev` | `git checkout dev` | Return to your development environment. |
| **4.2** | Sync `dev` with `main` | `git merge main` | Incorporates the changes you just pushed to `main` back into your `dev` branch. |
| **4.3** | **Continue** | *Go back to Step 2.2* | The cycle restarts, with `dev` based on the latest stable code. |