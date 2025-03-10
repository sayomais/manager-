// Helper functions for interacting with the Telegram Bot API

export async function sendTelegramMessage(chatId: number | string, text: string, options: any = {}) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`

  const response = await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
      ...options,
    }),
  })

  return await response.json()
}

export async function getChatMember(chatId: number | string, userId: number | string) {
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

  return await response.json()
}

export async function restrictChatMember(
  chatId: number | string,
  userId: number | string,
  permissions: any,
  untilDate = 0,
) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/restrictChatMember`

  const response = await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      user_id: userId,
      permissions: permissions,
      until_date: untilDate,
    }),
  })

  return await response.json()
}

export async function banChatMember(
  chatId: number | string,
  userId: number | string,
  untilDate = 0,
  revokeMessages = false,
) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/banChatMember`

  const response = await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      user_id: userId,
      until_date: untilDate,
      revoke_messages: revokeMessages,
    }),
  })

  return await response.json()
}

export async function unbanChatMember(chatId: number | string, userId: number | string, onlyIfBanned = true) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/unbanChatMember`

  const response = await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      user_id: userId,
      only_if_banned: onlyIfBanned,
    }),
  })

  return await response.json()
}

export async function deleteMessage(chatId: number | string, messageId: number) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/deleteMessage`

  const response = await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
    }),
  })

  return await response.json()
}

export async function setWebhook(url: string) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`

  const response = await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
      allowed_updates: ["message", "edited_message", "channel_post", "edited_channel_post", "callback_query"],
    }),
  })

  return await response.json()
}

export async function getWebhookInfo() {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`

  const response = await fetch(TELEGRAM_API)
  return await response.json()
}

