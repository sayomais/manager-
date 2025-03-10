import { type NextRequest, NextResponse } from "next/server"

// This is where Telegram will send updates
export async function POST(request: NextRequest) {
  try {
    const update = await request.json()

    // Process the update from Telegram
    await processUpdate(update)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Failed to process update" }, { status: 500 })
  }
}

async function processUpdate(update: any) {
  // Check if this is a message
  if (update.message) {
    await handleMessage(update.message)
  }

  // Check if this is a new chat member
  if (update.message?.new_chat_member) {
    await handleNewMember(update.message)
  }

  // Check if this is a left chat member
  if (update.message?.left_chat_member) {
    await handleLeftMember(update.message)
  }
}

async function handleMessage(message: any) {
  // Check for commands
  if (message.text?.startsWith("/")) {
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

async function handleCommand(message: any) {
  const command = message.text.split(" ")[0].toLowerCase()

  switch (command) {
    case "/start":
    case "/help":
      await sendHelp(message.chat.id)
      break
    case "/ban":
      if (await isAdmin(message.chat.id, message.from.id)) {
        await banUser(message)
      }
      break
    case "/kick":
      if (await isAdmin(message.chat.id, message.from.id)) {
        await kickUser(message)
      }
      break
    case "/warn":
      if (await isAdmin(message.chat.id, message.from.id)) {
        await warnUser(message.chat.id, getUserIdFromReply(message))
      }
      break
    // Add more commands as needed
  }
}

async function handleNewMember(message: any) {
  // Send welcome message
  await sendMessage(
    message.chat.id,
    `Welcome to the group, ${message.new_chat_member.first_name}! Please read the rules and enjoy your stay.`,
  )
}

async function handleLeftMember(message: any) {
  // Optional: Log or notify about member leaving
  console.log(`User ${message.left_chat_member.first_name} left the chat ${message.chat.id}`)
}

// Helper functions
async function sendMessage(chatId: number, text: string) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`

  await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    }),
  })
}

async function deleteMessage(chatId: number, messageId: number) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/deleteMessage`

  await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
    }),
  })
}

async function banUser(message: any) {
  const userId = getUserIdFromReply(message)
  if (!userId) return

  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/banChatMember`

  await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: message.chat.id,
      user_id: userId,
    }),
  })

  await sendMessage(message.chat.id, `User has been banned.`)
}

async function kickUser(message: any) {
  const userId = getUserIdFromReply(message)
  if (!userId) return

  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/banChatMember`

  // Ban and then unban to kick
  await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: message.chat.id,
      user_id: userId,
      revoke_messages: false,
    }),
  })

  // Unban immediately
  const UNBAN_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/unbanChatMember`
  await fetch(UNBAN_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: message.chat.id,
      user_id: userId,
      only_if_banned: true,
    }),
  })

  await sendMessage(message.chat.id, `User has been kicked.`)
}

async function warnUser(chatId: number, userId: number) {
  // In a real implementation, you would store warnings in a database
  await sendMessage(chatId, `⚠️ Warning: User <code>${userId}</code> has been warned.`)
}

async function sendHelp(chatId: number) {
  const helpText = `
<b>TeleGuard Bot Commands</b>

/help - Show this help message
/ban - Ban a user (reply to their message)
/kick - Kick a user (reply to their message)
/warn - Warn a user (reply to their message)
/rules - Show group rules
/settings - Adjust bot settings (admin only)

For more help, contact @YourUsername
`
  await sendMessage(chatId, helpText)
}

async function isAdmin(chatId: number, userId: number): Promise<boolean> {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChatMember`

  const response = await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
}

async function isSpam(message: any): Promise<boolean> {
  // Simple spam detection - in a real bot, this would be more sophisticated
  if (!message.text) return false

  // Check for all caps
  if (message.text.length > 10 && message.text === message.text.toUpperCase()) {
    return true
  }

  // Check for message repetition
  // This would require storing recent messages in a database

  // Check for excessive links
  const urlCount = (message.text.match(/https?:\/\//g) || []).length
  if (urlCount > 3) {
    return true
  }

  return false
}

function getUserIdFromReply(message: any): number | null {
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

