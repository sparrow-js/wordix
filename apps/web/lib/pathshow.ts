import fs from "node:fs";
import path from "node:path";

export function getPathContent() {
  try {
    const workerPath = path.join(process.cwd(), ".next", "server");
    const items = fs.readdirSync(workerPath);
    console.log("[.next directory contents]:", items);

    // Get size information for .next directory
    const stats = items.map((item) => {
      const fullPath = path.join(workerPath, item);
      try {
        const stat = fs.statSync(fullPath);
        return {
          name: item,
          size: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
          isDirectory: stat.isDirectory(),
        };
      } catch (e) {
        return { name: item, error: "Unable to read stats" };
      }
    });

    console.log("[.next directory sizes]:", JSON.stringify(stats, null, 2));
    return stats;
  } catch (err) {
    console.error("Error reading directory:", err);
    return [];
  }
}
