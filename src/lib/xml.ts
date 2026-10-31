export function escapeXml(text: string) {
	return text.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);
}
