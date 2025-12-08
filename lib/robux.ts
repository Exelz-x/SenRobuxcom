export function calculateGamepassPrice(targetRobux: number): number {
  // Player ingin menerima "targetRobux".
  // Roblox potong ±30%, jadi kita bagi 0.7 dan bulatkan ke atas.
  return Math.ceil(targetRobux / 0.7);
}