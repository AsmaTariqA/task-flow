# ** Notes**

---

## **1️⃣ Building APIs (Backend Basics)**

* **API:** A way for apps to talk to each other. Think of it as a waiter taking orders between the user and the kitchen (database).

* **FastAPI:** A tool to make APIs quickly and safely. Automatically gives you a mini “documentation page” to test your API.

* **Routes:** Different paths for different actions:

  * `POST` → create something new
  * `GET` → get information
  * `PUT` → update existing info
  * `DELETE` → remove something

* **Models:** A “template” for your data. Example: a task always has a title, description, and status.

* **Errors:** If something goes wrong, the API tells you with a message like `404 Not Found` or `500 Server Error`.

---

## **2️⃣ Working with Databases**

* **Database:** Where your app stores info. Imagine a big spreadsheet.
* **Primary Key (PK):** Unique ID for each row (like a passport number).
* **Foreign Key (FK):** Connects one table to another (like linking a task to its user).
* **UUID:** A very long, unique ID that avoids collisions. Think of it as a very secure serial number.
* **Timestamps:** Keep track of when things were created or updated.

**Tip:** Always make sure the things you reference (like users or projects) exist in the database first. Otherwise, it will crash.

---

## **3️⃣ REST API Tips**

* Always use the right method (`GET`, `POST`, `PUT`, `DELETE`).
* Keep your responses consistent, for example:

  ```json
  {
    "id": "123",
    "title": "My Task",
    "status": "todo",
    "created_at": "2025-12-06"
  }
  ```
* Test your API using tools like **Postman** or the FastAPI docs page.

---

## **4️⃣ Python Helpers**

* **UUIDs:** For unique IDs:

  ```python
  from uuid import uuid4
  new_id = uuid4()
  ```
* **Current Time:** Use UTC to avoid timezone confusion:

  ```python
  from datetime import datetime
  now = datetime.utcnow()
  ```
* **Type hints:** Helps you know what kind of data functions expect:

  ```python
  def get_task(task_id: str) -> dict:
      ...
  ```

---
---

## **6️⃣ Working with Data (MongoDB / NoSQL)**

* Stores info in “documents” (like mini JSON files) instead of tables.
* Common actions:

  * `Insert` → Add new data
  * `Find` → Look up data
  * `Update` → Change data
  * `Delete` → Remove data

---

## **7️⃣ General Tips**

* Always validate user input. Don’t trust any data blindly.
* Keep IDs consistent (use UUIDs when possible).
* Organize your code: separate models, services, and routes for clarity.
* Log errors to understand what went wrong.

---

## **8️⃣ Debugging Made Simple**

* Check that related data exists before inserting (like the user or project).
* Always inspect API responses for errors.
* Start small: test one endpoint or feature at a time.




## ** Today’s Backend Adventure – Supabase & File Upload Madness **
1. Environment Setup

Started by setting up a clean Python virtual environment.

Installed Supabase client and dotenv packages to manage secrets.

Created a .env file to store Supabase URL, keys, bucket names, and JWT secret.

Learned that Python is super picky about indentation — a single misplaced space can break everything.

2. Supabase Client Initialization

Needed to connect the backend to Supabase to do operations like uploading files.

Environment variables must be loaded correctly; otherwise, Supabase complains that the URL or key is missing.

Realized that running scripts outside the virtual environment causes package import errors.

3. Authentication Issues

Discovered that users must be logged in to upload files.

Ran into the dreaded “Email not confirmed” error, even though the test user was confirmed — this was tricky and needed verification in the Supabase dashboard.

Learned that Supabase v2 returns objects instead of dictionaries, so old subscript access ([]) doesn’t work; you have to use dot notation.

4. File Upload Struggles

Uploaded files to Supabase storage bucket using the logged-in user’s access token.

Ran into multiple access errors caused by row-level security (RLS) policies on buckets.

Learned that anonymous uploads don’t work if the bucket policy only allows logged-in users.

Realized that specifying the full file path (like from Desktop) prevents “file not found” headaches.

5. Key Takeaways

Environment variables and authentication are the heart of Supabase operations.

Supabase’s RLS and bucket policies can be tricky — always test with the right user.

Python is sensitive to indentation and package scopes.

Supabase v2 API changes how responses are structured — objects, not dicts.

Patience is required when things fail repeatedly; small config tweaks can solve big errors.

6. Reflection

Wish I could start frontend today but fate decided to teach me how to upload files to supabase storage. 