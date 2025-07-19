import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script para bloquear commits automáticos
async function setupAntiAutoCommit() {
  console.log("🛡️ Configurando proteção contra commits automáticos...");

  const hooksDir = ".git/hooks";
  const preCommitHook = path.join(hooksDir, "pre-commit");

  const hookContent = `#!/bin/sh
# Anti-Auto-Commit Protection
# Bloqueia commits automáticos não autorizados

# Verifica se é um commit manual (tem variável de ambiente)
if [ -z "$MANUAL_COMMIT" ]; then
  echo "🚨 COMMIT AUTOMÁTICO BLOQUEADO!"
  echo "Use: MANUAL_COMMIT=true git commit -m 'sua mensagem'"
  exit 1
fi

echo "✅ Commit manual autorizado"
exit 0
`;

  try {
    // Cria o hook de pre-commit
    fs.writeFileSync(preCommitHook, hookContent);

    // Torna executável (no Windows isso pode não ser necessário)
    try {
      fs.chmodSync(preCommitHook, "755");
    } catch (e) {
      // Ignora erro de chmod no Windows
    }

    console.log("✅ Hook de pre-commit criado!");
    console.log("🛡️ Agora commits automáticos serão bloqueados");
    console.log("📝 Para fazer commits manuais, use:");
    console.log("   MANUAL_COMMIT=true git commit -m 'sua mensagem'");
  } catch (error) {
    console.error("❌ Erro ao criar hook:", error.message);
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  setupAntiAutoCommit();
}

module.exports = { setupAntiAutoCommit };
