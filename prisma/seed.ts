import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const expeditionsPath = path.join(
    __dirname,
    "../../react-next-backend/darkest/data/expeditions.json"
  );
  const expeditions = JSON.parse(fs.readFileSync(expeditionsPath, "utf-8"));

  for (let i = 0; i < expeditions.recommendations.length; i++) {
    await prisma.dungeonRecommendation.upsert({
      where: { dungeonId: i },
      update: { data: JSON.stringify(expeditions.recommendations[i]) },
      create: { dungeonId: i, data: JSON.stringify(expeditions.recommendations[i]) },
    });
  }

  console.log(`Seeded ${expeditions.recommendations.length} DungeonRecommendation records.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
