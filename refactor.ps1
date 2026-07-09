$path = "C:/Users/Adrian/.gemini/antigravity/scratch/portfolio_os/src/components/Desktop.tsx"
$content = Get-Content -Raw $path

# 1. Add imports
$imports = @"
import { triggerHaptic } from '../lib/haptics';
import { TechRadarWidget, GitHubActivityWidget, QuickContactWidget } from './Widgets';
import { useDesktopIconLayout } from './desktop/useDesktopIconLayout';
import { useDesktopContextMenu } from './desktop/useDesktopContextMenu';
import { DesktopContextMenu } from './desktop/DesktopContextMenu';
import { DesktopIconGrid } from './desktop/DesktopIconGrid';
"@
$content = $content -replace '(?s)import \{ triggerHaptic \}.*?\./Widgets'';', $imports

# 2. Remove Clock and Note Widgets
$content = $content -replace '(?s)const ClockWidgetComponent: React.FC.*?const NoteWidgetComponent.*?</div>\s*\);\s*};\s*', ''

# 3. Replace Context Menu state logic
$contextMenuHook = "  const { contextMenu, setContextMenu, handleContextMenu } = useDesktopContextMenu(config);"
$content = $content -replace '(?s)const \[contextMenu, setContextMenu\].*?return \(\) => window\.removeEventListener\(''click'', closeMenu\);\s*\}, \[\]\);', $contextMenuHook

# 4. Remove helper functions
$content = $content -replace '(?s)const renderIcon = \(name: string,.*?const getWidgetSizeClasses =.*?return isMobile \?.*?\}\s*\};\s*', ''

# 5. Replace Drag Handlers
$dragHook = "  const { handleDragEnd, handleMobileReorder } = useDesktopIconLayout(setIcons);"
$content = $content -replace '(?s)const handleMobileReorder =.*?if \(targetR !== -1 && targetC !== -1\) \{.*?\s*\}\s*\};\s*', $dragHook

# 6. Remove old context menu handler
$content = $content -replace '(?s)const handleContextMenu = \(e: React\.MouseEvent.*?setContextMenu\(\{ x, y, icon \}\);\s*\};\s*', ''

# 7. Replace the Grid map
$gridReplacement = @"
      {/* Grid or Stack items */}
      <DesktopIconGrid
        icons={icons}
        displayedIcons={displayedIcons}
        config={config}
        isMobile={isMobile}
        isWiggling={isWiggling}
        gridCells={gridCells}
        isDraggingRef={isDraggingRef}
        handleIconClick={handleIconClick}
        handleContextMenu={handleContextMenu}
        handleDeleteIcon={handleDeleteIcon}
        handleOpenEdit={handleOpenEdit}
        handleOpenAddElement={handleOpenAddElement}
        startPress={startPress}
        endPress={endPress}
        handleDragEnd={handleDragEnd}
        handleMobileReorder={handleMobileReorder}
        openApp={openApp}
      />
"@
$content = $content -replace '(?s)\{/\* Grid or Stack items \*/\}.*?(?=\s*\{/\* Context Menu Component \*/\})', $gridReplacement

# 8. Replace Context Menu component rendering
$contextMenuComp = @"
      {/* Context Menu Component */}
      <DesktopContextMenu 
        contextMenu={contextMenu} 
        setContextMenu={setContextMenu} 
        handleOpenEdit={handleOpenEdit} 
        handleDeleteIcon={handleDeleteIcon} 
      />
"@
$content = $content -replace '(?s)\{/\* Context Menu Component \*/\}.*?Usuń ikonę\s*</button>\s*</div>\s*\}', $contextMenuComp

Set-Content -Path $path -Value $content
