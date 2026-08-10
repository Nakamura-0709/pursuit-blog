import type { DynamoDBStreamHandler } from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
	SecretsManagerClient,
	GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const sesClient = new SESClient({});
const secretsClient = new SecretsManagerClient({});

interface ContactData {
	id: string;
	name: string;
	email: string;
	subject?: string;
	message: string;
	createdAt: string;
	updatedAt: string;
}

interface EmailSecrets {
	fromEmail: string;
	toEmail: string;
}

interface DiscordSecrets {
	contactWebhookUrl: string;
}

async function getEmailSecrets(): Promise<EmailSecrets> {
	const secretsArn = process.env.EMAIL_SECRETS_ARN;

	if (!secretsArn) {
		throw new Error("EMAIL_SECRETS_ARN environment variable is required");
	}

	try {
		const command = new GetSecretValueCommand({
			SecretId: secretsArn,
		});

		const response = await secretsClient.send(command);

		if (!response.SecretString) {
			throw new Error("Secret value is empty");
		}

		const secrets = JSON.parse(response.SecretString);

		if (!secrets.fromEmail || !secrets.toEmail) {
			throw new Error("fromEmail and toEmail are required in secrets");
		}

		return {
			fromEmail: secrets.fromEmail,
			toEmail: secrets.toEmail,
		};
	} catch (error) {
		console.error("Error getting email secrets:", error);
		throw new Error("Failed to get email secrets");
	}
}

async function getDiscordSecrets(): Promise<DiscordSecrets> {
	const secretsArn = process.env.DISCORD_SECRETS_ARN;

	if (!secretsArn) {
		throw new Error("DISCORD_SECRETS_ARN environment variable is required");
	}

	try {
		const command = new GetSecretValueCommand({
			SecretId: secretsArn,
		});

		const response = await secretsClient.send(command);

		if (!response.SecretString) {
			throw new Error("Secret value is empty");
		}

		const secrets = JSON.parse(response.SecretString);

		if (!secrets.contactWebhookUrl) {
			throw new Error("contactWebhookUrl is required in secrets");
		}

		return {
			contactWebhookUrl: secrets.contactWebhookUrl,
		};
	} catch (error) {
		console.error("Error getting Discord secrets:", error);
		throw new Error("Failed to get Discord secrets");
	}
}

async function sendNotificationEmail(contactData: ContactData): Promise<void> {
	try {
		const { fromEmail, toEmail } = await getEmailSecrets();

		const emailParams = {
			Source: fromEmail,
			Destination: {
				ToAddresses: [toEmail],
			},
			Message: {
				Subject: {
					Data: `新しいお問い合わせ: ${contactData.name}様より`,
					Charset: "UTF-8",
				},
				Body: {
					Text: {
						Data: `
新しいお問い合わせが届きました。

ID: ${contactData.id}
名前: ${contactData.name}
メールアドレス: ${contactData.email}
件名: ${contactData.subject || "（件名なし）"}
メッセージ:
${contactData.message}

受信日時: ${contactData.createdAt}
---
このメールは自動送信されています。
          `,
						Charset: "UTF-8",
					},
					Html: {
						Data: `
<h2>新しいお問い合わせが届きました</h2>
<p><strong>ID:</strong> ${contactData.id}</p>
<p><strong>名前:</strong> ${contactData.name}</p>
<p><strong>メールアドレス:</strong> ${contactData.email}</p>
<p><strong>件名:</strong> ${contactData.subject || "（件名なし）"}</p>
<p><strong>メッセージ:</strong></p>
<p>${contactData.message.replace(/\n/g, "<br>")}</p>
<p><strong>受信日時:</strong> ${contactData.createdAt}</p>
<hr>
<p><small>このメールは自動送信されています。</small></p>
          `,
						Charset: "UTF-8",
					},
				},
			},
		};

		await sesClient.send(new SendEmailCommand(emailParams));
		console.log("Notification email sent successfully");
	} catch (error) {
		console.error("Error sending notification email:", error);
		throw error;
	}
}

async function sendDiscordNotification(
	contactData: ContactData,
): Promise<void> {
	try {
		const { contactWebhookUrl } = await getDiscordSecrets();

		const discordPayload = {
			embeds: [
				{
					title: "新しいお問い合わせが届きました",
					color: 0x00ff00,
					fields: [
						{
							name: "名前",
							value: contactData.name,
							inline: true,
						},
						{
							name: "メールアドレス",
							value: contactData.email,
							inline: true,
						},
						{
							name: "件名",
							value: contactData.subject || "（件名なし）",
							inline: false,
						},
						{
							name: "メッセージ",
							value:
								contactData.message.length > 1000
									? `${contactData.message.substring(0, 1000)}...`
									: contactData.message,
							inline: false,
						},
						{
							name: "ID",
							value: contactData.id,
							inline: true,
						},
						{
							name: "受信日時",
							value: contactData.createdAt,
							inline: true,
						},
					],
					timestamp: contactData.createdAt,
				},
			],
		};

		const response = await fetch(contactWebhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(discordPayload),
		});

		if (!response.ok) {
			throw new Error(
				`Discord API error: ${response.status} ${response.statusText}`,
			);
		}

		console.log("Discord notification sent successfully");
	} catch (error) {
		console.error("Error sending Discord notification:", error);
		throw error;
	}
}

async function sendAutoReplyEmail(contactData: ContactData): Promise<void> {
	try {
		const { fromEmail } = await getEmailSecrets();

		const emailParams = {
			Source: fromEmail,
			Destination: {
				ToAddresses: [contactData.email],
			},
			Message: {
				Subject: {
					Data: `【自動返信】お問い合わせを受け付けました - ${contactData.subject || "お問い合わせ"}`,
					Charset: "UTF-8",
				},
				Body: {
					Text: {
						Data: `
${contactData.name} 様

お問い合わせいただきありがとうございます。
お問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【お問い合わせ内容】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

お名前: ${contactData.name}
メールアドレス: ${contactData.email}
件名: ${contactData.subject || "（件名なし）"}
メッセージ:
${contactData.message}

受信日時: ${contactData.createdAt}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ご入力いただいた内容を確認の上、担当者より回答させていただきます。
しばらくお待ちください。

なお、このメールは自動送信されています。
このメールに返信いただいても回答できませんので、ご了承ください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pursuit - Portfolio & Blog
https://pursuit-blog.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `,
						Charset: "UTF-8",
					},
				},
			},
		};

		await sesClient.send(new SendEmailCommand(emailParams));
		// 宛先メールアドレスはログに出さない（個人情報のため）
		console.log("Auto-reply email sent successfully:", contactData.id);
	} catch (error) {
		console.error("Error sending auto-reply email:", error);
		throw error;
	}
}

export const handler: DynamoDBStreamHandler = async (event) => {
	// イベント全体はNewImageに氏名・メール・本文を含むためログに出さない
	console.log("Processing DynamoDB Stream event:", {
		recordCount: event.Records.length,
	});

	for (const record of event.Records) {
		try {
			// INSERTイベントのみ処理
			if (record.eventName !== "INSERT") {
				console.log(`Skipping ${record.eventName} event`);
				continue;
			}

			// 新しいデータを取得
			if (!record.dynamodb?.NewImage) {
				console.log("No NewImage found in record");
				continue;
			}

			const contactData: ContactData = {
				id: record.dynamodb.NewImage.id.S ?? "",
				name: record.dynamodb.NewImage.name.S ?? "",
				email: record.dynamodb.NewImage.email.S ?? "",
				subject: record.dynamodb.NewImage.subject?.S || "",
				message: record.dynamodb.NewImage.message.S ?? "",
				createdAt: record.dynamodb.NewImage.createdAt.S ?? "",
				updatedAt: record.dynamodb.NewImage.updatedAt.S ?? "",
			};

			// 氏名・メール・本文はログに出さない（個人情報のため）
			console.log("Processing contact data:", {
				id: contactData.id,
				messageLength: contactData.message.length,
			});

			// 並行してメールとDiscord通知を送信
			const promises = [
				sendNotificationEmail(contactData),
				sendDiscordNotification(contactData),
				sendAutoReplyEmail(contactData), // 自動返信メールも追加
			];

			await Promise.allSettled(promises);

			console.log(
				"Notification processing completed for contact ID:",
				contactData.id,
			);
		} catch (error) {
			console.error("Error processing record:", error);
			// エラーが発生しても他のレコードの処理は継続
		}
	}
};
