'use client'

export function useTaskFiles() {
 
  const uploadFile = async (
    taskId: string,
    userId: string,
    file: File
  ) => {
    const formData = new FormData()
    formData.append('file', file) // only the file

    // ✅ Send task_id & user_id in query string
    const res = await fetch(`http://localhost:8000/api/files/upload?task_id=${taskId}&user_id=${userId}`, {
      method: 'POST',
      body: formData,
    })

    const text = await res.text()

    if (!res.ok) {
      console.error('UPLOAD FAILED:', text)
      throw new Error(text)
    }

    return JSON.parse(text)
  }

  return { uploadFile }
}


