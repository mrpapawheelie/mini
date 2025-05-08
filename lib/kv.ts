import { FrameNotificationDetails } from "@farcaster/frame-sdk";

const notificationServiceKey =
  process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? "minikit";

function getUserNotificationDetailsKey(fid: number): string {
  return `${notificationServiceKey}:user:${fid}`;
}

export async function getUserNotificationDetails(
  fid: number,
): Promise<FrameNotificationDetails | null> {
  if (!process.env.CLOUDFLARE_KV) {
    console.warn("CLOUDFLARE_KV environment variable is not defined");
    return null;
  }

  try {
    const kv = process.env.CLOUDFLARE_KV;
    const value = await kv.get(getUserNotificationDetailsKey(fid));
    return value ? JSON.parse(value as string) : null;
  } catch (error) {
    console.error("Error getting notification details from KV:", error);
    return null;
  }
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails,
): Promise<void> {
  if (!process.env.CLOUDFLARE_KV) {
    console.warn("CLOUDFLARE_KV environment variable is not defined");
    return;
  }

  try {
    const kv = process.env.CLOUDFLARE_KV;
    await kv.put(
      getUserNotificationDetailsKey(fid),
      JSON.stringify(notificationDetails),
      { expirationTtl: 60 * 60 * 24 * 30 } // 30 days expiration
    );
  } catch (error) {
    console.error("Error setting notification details in KV:", error);
  }
}

export async function deleteUserNotificationDetails(
  fid: number,
): Promise<void> {
  if (!process.env.CLOUDFLARE_KV) {
    console.warn("CLOUDFLARE_KV environment variable is not defined");
    return;
  }

  try {
    const kv = process.env.CLOUDFLARE_KV;
    await kv.delete(getUserNotificationDetailsKey(fid));
  } catch (error) {
    console.error("Error deleting notification details from KV:", error);
  }
} 