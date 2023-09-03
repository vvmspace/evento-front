import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGuard } from "../../../../core/guards/api-guard";

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.body) {
    ApiGuard(event);
  }

  const { from, message } = event.body ? JSON.parse(event.body) : {}; // Вы можете заменить это на динамическое сообщение из вашего события или другого источника

  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `${message}\n\n${from ? `*From: * ${from}` : ""}`,
        parse_mode: "Markdown",
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to send message to Telegram. Response: ${JSON.stringify(
          responseData,
        )}`,
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notification sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending notification:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send notification" }),
    };
  }
};
