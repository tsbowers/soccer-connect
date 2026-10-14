async function main() {
  const { sql } = require("@vercel/postgres");
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error("Uso: node scripts/run-migration.js <ruta-al-archivo.sql>");
    process.exit(1);
  }
  const fs = require("fs");
  const migrationSql = fs.readFileSync(migrationFile, "utf-8");
  console.log("Ejecutando:", migrationFile);
  await sql.query(migrationSql);
  console.log("Migración aplicada correctamente.");
}

main().catch((err) => {
  console.error("Error al ejecutar la migración:", err);
  process.exit(1);
});
