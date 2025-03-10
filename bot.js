import fetch from "node-fetch"

// Bot configuration
const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API_URL = `https://api.telegram.org/bot${TOKEN}`
let offset = 0

// Start the bot
console.log("Starting TeleGuard bot...")
startPolling()

// Main polling function
async function startPolling() {
  try {
    console.log("Bot is running. Press Ctrl+C to stop.")

    while (true) {
      try {
        // Get updates with long polling
        const updates = await getUpdates()

        if (updates && updates.length > 0) {
          // Process each update
          for (const update of updates) {
            await processUpdate(update)
            // Update offset to acknowledge this update
            offset = update.update_id + 1
          }
        }
      } catch (error) {
        console.error("Error in polling cycle:", error.message)
        // Continue polling even if there's an error
      }
    }
  } catch (error) {
    console.error("Fatal error:", error)
    process.exit(1)
  }
}

// Get updates from Telegram
async function getUpdates() {
  try {
    const response = await fetch(`${API_URL}/getUpdates?offset=${offset}&timeout=30`)
    const data = await response.json()

    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`)
    }

    return data.result
  } catch (error) {
    console.error("Error getting updates:", error.message)
    // Wait a bit before retrying on error
    await new Promise((resolve) => setTimeout(resolve, 5000))
    return []
  }
}

// Process an update from Telegram
async function processUpdate(update) {
  console.log(`Processing update ${update.update_id}`)

  // Handle different types of updates
  if (update.message) {
    await handleMessage(update.message)
  } else if (update.callback_query) {
    await handleCallbackQuery(update.callback_query)
  }
}

// Handle incoming messages
async function handleMessage(message) {
  // Log message for debugging
  console.log(`Message from ${message.from.id} in chat ${message.chat.id}: ${message.text || "[no text]"}`)

  // Check for new chat members
  if (message.new_chat_member) {
    await handleNewMember(message)
    return
  }

  // Check for left chat members
  if (message.left_chat_member) {
    await handleLeftMember(message)
    return
  }

  // Check for commands
  if (message.text && message.text.startsWith("/")) {
    await handleCommand(message)
    return
  }

  // Check for spam
  if (await isSpam(message)) {
    await deleteMessage(message.chat.id, message.message_id)
    await warnUser(message.chat.id, message.from.id)
    return
  }
}

// Handle commands
async function handleCommand(message) {
  const command = message.text.split(" ")[0].toLowerCase()

  switch (command) {
    case "/start":
    case "/help":
      await sendHelp(message.chat.id)
      break
    case "/ban":
      if (await isAdmin(message.chat.id, message.from.id)) {
        await banUser(message)
      } else {
        await sendMessage(message.chat.id, "You don't have permission to use this command.")
      }
      break
    case "/kick":
      if (await isAdmin(message.chat.id, message.from.id)) {
        await kickUser(message)
      } else {
        await sendMessage(message.chat.id, "You don't have permission to use this command.")
      }
      break
    case "/warn":
      if (await isAdmin(message.chat.id, message.from.id)) {
        await warnUser(message.chat.id, getUserIdFromReply(message))
      } else {
        await sendMessage(message.chat.id, "You don't have permission to use this command.")
      }
      break
    case "/rules":
      await sendRules(message.chat.id)
      break
    default:
      // Unknown command
      break
  }
}

// Handle callback queries (for inline buttons)
async function handleCallbackQuery(query) {
  console.log(`Callback query from ${query.from.id}: ${query.data}`)

  // Acknowledge the callback query
  await fetch(`${API_URL}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: query.id }),
  })

  // Process different callback data
  const data = query.data

  if (data.startsWith("warn_")) {
    const userId = data.split("_")[1]
    if (await isAdmin(query.message.chat.id, query.from.id)) {
      await warnUser(query.message.chat.id, userId)
    }
  } else if (data.startsWith("kick_")) {
    const userId = data.split("_")[1]
    if (await isAdmin(query.message.chat.id, query.from.id)) {
      await kickUserById(query.message.chat.id, userId)
    }
  } else if (data.startsWith("ban_")) {
    const userId = data.split("_")[1]
    if (await isAdmin(query.message.chat.id, query.from.id)) {
      await banUserById(query.message.chat.id, userId)
    }
  }
}

// Handle new members
async function handleNewMember(message) {
  const newUser = message.new_chat_member
  const chatId = message.chat.id

  // Skip if the new member is a bot
  if (newUser.is_bot) return

  // Send welcome message
  const welcomeText = `Welcome to the group, ${newUser.first_name}! 👋\n\nPlease read the rules and enjoy your stay.`
  await sendMessage(chatId, welcomeText)
}

// Handle members leaving
async function handleLeftMember(message) {
  console.log(`User ${message.left_chat_member.first_name} left chat ${message.chat.id}`)
}

// Send a message to a chat
async function sendMessage(chatId, text, options = {}) {
  try {
    const response = await fetch(`${API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        ...options,
      }),
    })

    const data = await response.json()
    if (!data.ok) {
      console.error(`Error sending message: ${data.description}`)
    }
    return data
  } catch (error) {
    console.error("Error sending message:", error.message)
  }
}

// Delete a message
async function deleteMessage(chatId, messageId) {
  try {
    const response = await fetch(`${API_URL}/deleteMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
      }),
    })

    const data = await response.json()
    if (!data.ok) {
      console.error(`Error deleting message: ${data.description}`)
    }
    return data
  } catch (error) {
    console.error("Error deleting message:", error.message)
  }
}

// Ban a user
async function banUser(message) {
  const userId = getUserIdFromReply(message)
  if (!userId) {
    await sendMessage(message.chat.id, "Please reply to a message from the user you want to ban.")
    return
  }

  return await banUserById(message.chat.id, userId)
}

// Ban a user by ID
async function banUserById(chatId, userId) {
  try {
    const response = await fetch(`${API_URL}/banChatMember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        user_id: userId,
      }),
    })

    const data = await response.json()
    if (data.ok) {
      await sendMessage(chatId, `User has been banned.`)
    } else {
      await sendMessage(chatId, `Failed to ban user: ${data.description}`)
    }
    return data
  } catch (error) {
    console.error("Error banning user:", error.message)
  }
}

// Kick a user
async function kickUser(message) {
  const userId = getUserIdFromReply(message)
  if (!userId) {
    await sendMessage(message.chat.id, "Please reply to a message from the user you want to kick.")
    return
  }

  return await kickUserById(message.chat.id, userId)
}

// Kick a user by ID
async function kickUserById(chatId, userId) {
  try {
    // Ban the user
    const banResponse = await fetch(`${API_URL}/banChatMember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        user_id: userId,
      }),
    })

    const banData = await banResponse.json()
    if (!banData.ok) {
      await sendMessage(chatId, `Failed to kick user: ${banData.description}`)
      return banData
    }

    // Unban the user immediately (this effectively kicks them)
    const unbanResponse = await fetch(`${API_URL}/unbanChatMember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        user_id: userId,
        only_if_banned: true,
      }),
    })

    const unbanData = await unbanResponse.json()
    if (unbanData.ok) {
      await sendMessage(chatId, `User has been kicked.`)
    } else {
      await sendMessage(chatId, `User was banned but could not be unbanned: ${unbanData.description}`)
    }

    return unbanData
  } catch (error) {
    console.error("Error kicking user:", error.message)
  }
}

// Warn a user
async function warnUser(chatId, userId) {
  if (!userId) {
    await sendMessage(chatId, "Could not identify the user to warn.")
    return
  }

  // In a real implementation, you would store warnings in a database
  // For now, we'll just send a message
  await sendMessage(chatId, `⚠️ Warning: User <code>${userId}</code> has been warned.`)
}

// Send help message
async function sendHelp(chatId) {
  const helpText = `
<b>TeleGuard Bot Commands</b>

/help - Show this help message
/ban - Ban a user (reply to their message)
/kick - Kick a user (reply to their message)
/warn - Warn a user (reply to their message)
/rules - Show group rules

For more help, contact @YourUsername
`
  await sendMessage(chatId, helpText)
}

// Send rules message
async function sendRules(chatId) {
  const rulesText = `
<b>Group Rules</b>

1. Be respectful to all members
2. No spam or excessive self-promotion
3. No NSFW content
4. Stay on topic
5. No hate speech or harassment

Violating these rules may result in warnings, kicks, or bans.
`
  await sendMessage(chatId, rulesText)
}

// Check if a user is an admin
async function isAdmin(chatId, userId) {
  try {
    const response = await fetch(`${API_URL}/getChatMember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        user_id: userId,
      }),
    })

    const data = await response.json()
    if (data.ok) {
      const status = data.result.status
      return status === "creator" || status === "administrator"
    }

    return false
  } catch (error) {
    console.error("Error checking admin status:", error.message)
    return false
  }
}

// Check if a message is spam
async function isSpam(message) {
  if (!message.text) return false

  // Check for all caps
  if (message.text.length > 10 && message.text === message.text.toUpperCase()) {
    return true
  }

  // Check for excessive links
  const urlCount = (message.text.match(/https?:\/\//g) || []).length
  if (urlCount > 3) {
    return true
  }

  return false
}

// Get user ID from a reply
function getUserIdFromReply(message) {
  if (message.reply_to_message) {
    return message.reply_to_message.from.id
  }

  // If command has arguments like "/ban 123456789"
  const parts = message.text.split(" ")
  if (parts.length > 1 && !isNaN(Number.parseInt(parts[1]))) {
    return Number.parseInt(parts[1])
  }

  return null
}

