# YouTube Clone — MERN Stack Capstone Project

A full-stack YouTube-style video platform built with **MongoDB**, **Express**, **React (Vite)**, and **Node.js**. Users can browse videos, search and filter by category, watch videos, like/dislike, manage comments, and create their own channel to upload/edit/delete videos.

---

## Step 1 — Configure the Backend

1. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```

2. Copy the example environment file:

   ```bash
   copy .env.example .env
   ```

3. Open `.env` in any text editor and set your values:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/youtube_clone
   JWT_SECRET=my_super_secret_key_change_this
   JWT_EXPIRES_IN=7d
   ```

4. Install backend packages:
   ```bash
   npm install
   ```

5. Load sample data into MongoDB:
   ```bash
   npm run seed
   ```

   You should see: `Database seeded successfully!`  
   Test login after seeding: **john@example.com** / **password123**

6. Start the backend server:
   ```bash
   npm run dev
   ```

   Keep this terminal open. You should see:
   ```
   MongoDB connected: 127.0.0.1
   Server running on port 5000
   ```

---

## Step 3 — Set Up and Run the Frontend

1. Open a **new terminal** (keep the backend running in the first one).

2. Go to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install frontend packages:
   ```bash
   npm install
   ```

4. Start the React app:
   ```bash
   npm run dev
   ```

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

You should see the YouTube Clone home page with video thumbnails.

---

## Step 4 — How to Use the App

### Browse Videos
- The home page shows a grid of videos.
- Use the **filter buttons** (All, Education, Tech, Gaming, Music, Entertainment, News) to filter by category.
- Use the **search bar** in the header to search videos by title.

### Sign In / Register
1. Click **Sign in** in the top-right corner.
2. On the auth page, register with username, email, and password.
3. After registering, you'll be redirected to the login form — sign in with your email and password.
4. Your username appears in the header after login.

### Watch a Video
- Click any video thumbnail to open the video player page.
- Use the **Like** and **Dislike** buttons (must be signed in).
- Add, edit, or delete your own comments in the comment section.

### Create a Channel & Upload Videos
1. Sign in first.
2. Open the sidebar → click **Your Channel**.
3. If you don't have a channel, click **Create Channel**.
4. Once your channel is created, click **Upload Video**.
5. Fill in title, description, video URL, and category — then submit.
6. Uploaded videos appear on the home page and match the correct filter category.
7. Use **Edit** or **Delete** on your channel page to manage your videos.

---

## API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/auth/me` | Get current user (requires token) |

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | Get all videos (supports `?search=` and `?category=`) |
| GET | `/api/videos/:videoId` | Get single video |
| POST | `/api/videos` | Upload video (protected) |
| PUT | `/api/videos/:videoId` | Update video (protected) |
| DELETE | `/api/videos/:videoId` | Delete video (protected) |
| POST | `/api/videos/:videoId/like` | Like a video (protected) |
| POST | `/api/videos/:videoId/dislike` | Dislike a video (protected) |

### Channels
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/channels` | Create channel (protected) |
| GET | `/api/channels/my` | Get your channels (protected) |
| GET | `/api/channels/:channelId` | Get channel with videos |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:videoId` | Get comments for a video |
| POST | `/api/comments/:videoId` | Add comment (protected) |
| PUT | `/api/comments/:commentId` | Edit comment (protected) |
| DELETE | `/api/comments/:commentId` | Delete comment (protected) |

---

## How JWT Authentication Works (Simple Explanation)

1. User logs in with email + password.
2. Backend checks the password against what's stored in MongoDB (hashed with bcrypt).
3. If correct, backend creates a **JWT token** — a signed string that says "this is user X".
4. Frontend saves the token in `localStorage`.
5. Every protected API request sends the token in the header: `Authorization: Bearer <token>`.
6. Backend middleware (`middleware/auth.js`) verifies the token before allowing the action.

---


## Technologies Used

- **Frontend:** React 18, Vite, React Router, Axios
- **Backend:** Node.js, Express.js (ES Modules)
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcryptjs

---

