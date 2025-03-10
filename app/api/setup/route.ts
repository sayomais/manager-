import { type NextRequest, NextResponse } from "next/server"
import { setWebhook, getWebhookInfo } from "@/lib/telegram"

// This route is used to set up the webhook for the Telegram bot
export async function GET(request: NextRequest) {
  try {
    // Get the current webhook info
    const webhookInfo = await getWebhookInfo()

    // If no webhook is set or it's different from our current URL, set it
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN is not set" }, { status: 500 })
    }

    if (!process.env.WEBHOOK_URL) {
      return NextResponse.json(
        {
          error: "WEBHOOK_URL is not set. Please set it to your deployed URL + /api/telegram/webhook",
          currentWebhook: webhookInfo,
        },
        { status: 500 },
      )
    }

    // Set the webhook
    const result = await setWebhook(process.env.WEBHOOK_URL)

    return NextResponse.json({
      success: result.ok,
      message: result.ok ? "Webhook set successfully" : "Failed to set webhook",
      result,
      webhookInfo: await getWebhookInfo(),
    })
  } catch (error) {
    console.error("Error setting up webhook:", error)
    return NextResponse.json({ error: "Failed to set up webhook" }, { status: 500 })
  }
}

