// exportarProyecto.js
const fs = require("fs");
const path = require("path");

// Carpetas/archivos a ignorar
const ignoreDirs = new Set([
  "node_modules", ".git", "dist", "build", ".next", ".vercel", ".nuxt",
  "coverage", ".turbo", ".idea", ".vscode", "out"
]);

// Extensiones de imagen que se omiten (solo se muestra la ruta)
const imageExts = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".tiff", ".tif", ".svg",
  ".avif", ".ico"
]);

function esDir(ruta) {
  try { return fs.statSync(ruta).isDirectory(); } catch { return false; }
}

function esImagen(ruta) {
  return imageExts.has(path.extname(ruta).toLowerCase());
}

function leerDirectorio(dir, output = []) {
  let items;
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return output; // sin permisos o errores de lectura
  }

  for (const entry of items) {
    const rutaCompleta = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) {
        leerDirectorio(rutaCompleta, output);
      }
      continue;
    }

    // Si es imagen: solo ruta, sin contenido
    if (esImagen(rutaCompleta)) {
      output.push(
        `\n=======================\n📄 ${rutaCompleta}\n=======================`
      );
      continue;
    }

    // Para otros archivos: intenta leer como texto
    try {
      const contenido = fs.readFileSync(rutaCompleta, "utf8");
      output.push(
        `\n=======================\n📄 ${rutaCompleta}\n=======================\n${contenido}`
      );
    } catch {
      // Si no es texto (binario u otro error), también solo ruta
      output.push(
        `\n=======================\n📄 ${rutaCompleta}\n=======================`
      );
    }
  }

  return output;
}

// Ejecutar desde la raíz actual del proyecto
const root = process.cwd();
const resultado = leerDirectorio(root);

// Guardar salida
fs.writeFileSync("export-proyecto.txt", resultado.join("\n"), "utf8");
console.log("✅ Proyecto exportado en export-proyecto.txt (imágenes sin contenido).");
