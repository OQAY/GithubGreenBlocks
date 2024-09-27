import fs from "fs";
import path from "path";

console.log("🛡️ Criando hook de proteção...");

const hookContent = `#!/bin/sh
# Anti-Auto-Commit Protection
echo "🚨 COMMIT AUTOMÁTICO BLOQUEADO!"
echo "Use: MANUAL_COMMIT=true git commit -m 'sua mensagem'"
exit 1
`;

const hookPath = ".git/hooks/pre-commit";

try {
  fs.writeFileSync(hookPath, hookContent);
  console.log("✅ Hook criado em:", hookPath);
  console.log("🛡️ Commits automáticos serão bloqueados!");
} catch (error) {
  console.error("❌ Erro:", error.message);
}
