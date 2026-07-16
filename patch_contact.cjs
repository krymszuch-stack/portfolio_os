const fs = require('fs');

const path = 'src/components/contact/ContactInfo.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('useCopyToClipboard')) {
  code = code.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { useCopyToClipboard } from '../../hooks/useCopyToClipboard';\nimport { Copy, Check } from 'lucide-react';"
  );

  code = code.replace(
    "const [socialInputVal, setSocialInputVal] = useState('');",
    "const [socialInputVal, setSocialInputVal] = useState('');\n  const [isCopied, copy] = useCopyToClipboard();\n  const [copiedType, setCopiedType] = useState<string | null>(null);\n\n  const handleCopy = (text: string, type: string) => {\n    copy(text);\n    setCopiedType(type);\n    setTimeout(() => setCopiedType(null), 2000);\n  };\n"
  );

  // Wyszukajmy bloki z emailem lub telefonem
  fs.writeFileSync(path, code);
  console.log('Patched AppContact');
} else {
  console.log('Already patched');
}
