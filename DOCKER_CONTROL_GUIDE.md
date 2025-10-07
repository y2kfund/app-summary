# Docker Container Control - Implementation Guide

## Overview
Implemented Docker container control and real-time status monitoring in `Summary.vue`. Users can start/stop containers and view their online/offline status directly from the breakdown section.

## Features

### ✅ Real-time Status Monitoring
- Polls container status every 10 seconds
- Visual indicators: 🟢 Online / 🔴 Offline
- Automatic status updates in breakdown header

### ✅ Container Controls
- **Start/Stop buttons** in breakdown header
- Loading states during operations
- Toast notifications on success/failure

### ✅ Error Handling
- 8-second timeout protection
- Graceful degradation on failures
- User-friendly error messages

## Implementation Details

### State Management
```typescript
// Container names as keys (bansi, cis, hediye, ovlg, sc, stamp, vk)
const containerStates = reactive<Record<string, ContainerState>>({
  'bansi': { isLoading: false, isStarting: false, isStopping: false },
  'cis': { isLoading: false, isStarting: false, isStopping: false },
  // ... all 7 containers
})
```

### Key Functions
- `startDockerContainer(containerName)` - Starts a container
- `stopDockerContainer(containerName)` - Stops a container
- `checkContainer(accountId)` - Polls container status
- `getContainerNameFromAccountId(accountId)` - Maps account ID to container name

### Account to Container Mapping
```javascript
{
  1: 'bansi',
  2: 'cis',
  3: 'hediye',
  4: 'ovlg',
  5: 'sc',
  6: 'stamp',
  7: 'vk'  // Vikas → vk
}
```

### API Endpoints

**Docker Control:**
```
https://ibkr-docker-manage.aiworkspace.pro/docker_control.php?action=start&container_name=cis
```

**Status Check:**
```
https://ibkr.{containerName}.to5001.aiworkspace.pro/api/maintenance
https://ibkr.vk.to5001.aiworkspace.pro/api/maintenance  (for Vikas)
```

## UI Components

### Breakdown Header
```
┌─────────────────────────────────────────────────────────────┐
│ Calculation breakdown for Client2:    [🟢 Online] [⏹️ Stop]  │
│ Assumptions: maintenance margin (m) = 30%                   │
└─────────────────────────────────────────────────────────────┘
```

### Toast Notifications
- Top-right corner
- Auto-dismiss after 4 seconds
- Success (green) / Error (red)

## Configuration

### Polling Settings
- **Interval**: 10 seconds
- **Timeout**: 8 seconds
- **Accounts**: 1-7 (all containers)
- **Staggered start**: 500ms delay between each

### Lifecycle
- **On Mount**: Start polling all containers
- **On Unmount**: Stop all timers

## Testing

1. **View Status**: Expand any account breakdown → see status badge
2. **Start Container**: Click "▶️ Start Container" → button shows "Starting..." → notification appears
3. **Stop Container**: Click "⏹️ Stop Container" → button shows "Stopping..." → notification appears
4. **Status Updates**: Status refreshes every 10 seconds automatically

## Common Issues

### "Container state not found"
**Cause**: Key mismatch between account IDs and container names  
**Fix**: Use container names (`'cis'`) not account IDs (`'2'`) as keys in `containerStates`

### Type errors: `nlv_internal_account_id` not found
**Cause**: Property doesn't exist on the calculated metrics type  
**Solution**: Use `nlv_id` from the query data instead

### Null index type error
**Cause**: `getContainerNameFromAccountId()` returns null  
**Fix**: Add null checks before using as array index

## File Structure
```
app-summary/src/views/Summary.vue
├── Types (ContainerState, Notification)
├── State (containerStates, notifications)
├── Functions
│   ├── Docker Control (start/stop)
│   ├── Status Polling (check/schedule)
│   ├── Helpers (mapping, display)
│   └── Notifications (show/remove)
├── Template
│   ├── Notification Container
│   ├── Breakdown Header (status + buttons)
│   └── Context Menu
└── Styles
    ├── Notification System
    ├── Docker Control Buttons
    └── Status Badges
```
