import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGuard } from "../../../../core/guards/api-guard";

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

export const handler: APIGatewayProxyHandler = async (event) => {
  ApiGuard(event);

  const { from, message } = event.body
    ? JSON.parse(event.body)
    : {
        message: "Empty message",
        from: "Notify",
      };

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
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to send notification",
          error: responseData,
        }),
      };
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
