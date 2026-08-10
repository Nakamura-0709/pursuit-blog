import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface ContactRequest {
	name: string;
	email: string;
	subject?: string;
	message: string;
}

export const handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	try {
		// CORSヘッダー
		const headers = {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers":
				"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
			"Access-Control-Allow-Methods": "POST,OPTIONS",
		};

		// OPTIONSリクエスト（CORS preflight）の処理
		if (event.httpMethod === "OPTIONS") {
			return {
				statusCode: 200,
				headers,
				body: "",
			};
		}

		// POSTリクエストの処理
		if (event.httpMethod !== "POST") {
			return {
				statusCode: 405,
				headers,
				body: JSON.stringify({ error: "Method not allowed" }),
			};
		}

		// リクエストボディの解析
		if (!event.body) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({ error: "Request body is required" }),
			};
		}

		const contactData: ContactRequest = JSON.parse(event.body);

		// バリデーション
		if (!contactData.name || !contactData.email || !contactData.message) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({
					success: false,
					error: "Name, email, and message are required",
				}),
			};
		}

		// DynamoDBに保存
		const tableName = process.env.CONTACTS_TABLE_NAME;

		if (!tableName) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({
					error: "CONTACTS_TABLE_NAME environment variable is required",
				}),
			};
		}

		const timestamp = new Date().toISOString();

		const item = {
			id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
			name: contactData.name,
			email: contactData.email,
			subject: contactData.subject || "",
			message: contactData.message,
			createdAt: timestamp,
			updatedAt: timestamp,
		};

		await docClient.send(
			new PutCommand({
				TableName: tableName,
				Item: item,
			}),
		);

		// 高速レスポンス（通知処理はLambda 2で非同期実行）
		return {
			statusCode: 201,
			headers,
			body: JSON.stringify({
				success: true,
				message: "Contact created successfully",
				id: item.id,
			}),
		};
	} catch (error) {
		console.error("Error creating contact:", error);

		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				success: false,
				error: "Internal server error",
			}),
		};
	}
};
