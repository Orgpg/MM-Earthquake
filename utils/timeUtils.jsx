// Convert to Myanmar time (UTC+6:30)
export function toMyanmarTime(timestamp) {
  const date = new Date(timestamp)

  // Create a date string with the Myanmar timezone offset
  const myanmarTimeString = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Yangon" }))

  return myanmarTimeString
}

// Format time for display
export function formatMyanmarTime(timestamp, includeSeconds = true) {
  const myanmarTime = toMyanmarTime(timestamp)

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // Always include seconds
    hour12: true,
  }).format(myanmarTime)
}

// Format time for display in list (Apr 01, 2025, 09:57 PM format)
export function formatMyanmarTimeForList(timestamp) {
  const myanmarTime = toMyanmarTime(timestamp)

  const month = myanmarTime.toLocaleString("en-US", { month: "short" })
  const day = myanmarTime.getDate().toString().padStart(2, "0")
  const year = myanmarTime.getFullYear()
  const hour = myanmarTime.getHours()
  const minute = myanmarTime.getMinutes().toString().padStart(2, "0")
  const second = myanmarTime.getSeconds().toString().padStart(2, "0")
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12

  return `${month} ${day}, ${year}, ${hour12}:${minute}:${second} ${ampm}`
}

// Get time ago
export function getTimeAgo(timestamp) {
  const seconds = Math.floor((new Date() - timestamp) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) return `${interval} years ago`
  if (interval === 1) return "1 year ago"

  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return `${interval} months ago`
  if (interval === 1) return "1 month ago"

  interval = Math.floor(seconds / 86400)
  if (interval > 1) return `${interval} days ago`
  if (interval === 1) return "1 day ago"

  interval = Math.floor(seconds / 3600)
  if (interval > 1) return `${interval} hours ago`
  if (interval === 1) return "1 hour ago"

  interval = Math.floor(seconds / 60)
  if (interval > 1) return `${interval} minutes ago`
  if (interval === 1) return "1 minute ago"

  return "Just now"
}

// Check if a date is today
export function isToday(timestamp) {
  const today = new Date()
  const date = new Date(timestamp)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

