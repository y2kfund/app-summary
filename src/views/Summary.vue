<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, reactive, inject, ref, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule } from 'ag-grid-community'
import type { ColDef, GridApi, ColumnApi } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useNlvMarginQuery, type nlvMargin } from '@y2kfund/core/nlvMargin'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useSupabase } from '@y2kfund/core'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { SummaryProps } from '../index'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = withDefaults(defineProps<SummaryProps>(), {
  showHeaderLink: false,
  userId: null
})

const emit = defineEmits<{
  'minimize': []
}>()

// Grid refs
const gridApi = ref<GridApi | null>(null)
const columnApiRef = ref<ColumnApi | null>(null)

const q = useNlvMarginQuery(10000, props.userId)

// State for graph visibility and selected account
const graphVisibility: { [key: number]: { nlv: boolean; mm: boolean } } = reactive({});
const selectedAccountForHistory = ref<number | null>(null)
const selectedGraphType = ref<'nlv' | 'mm' | null>(null)

// Add missing breakdownVisibility reactive object
const breakdownVisibility: { [key: number]: boolean } = reactive({});

// Add URL parameter tracking
const selectedClientFromUrl = ref<string | null>(null)

// Docker Container Control Types
type ContainerState = {
  isLoading: boolean
  isStarting: boolean
  isStopping: boolean
  lastUpdated?: Date | null
  online?: boolean
  lastError?: string | null
}

type Notification = {
  id: number
  type: 'success' | 'error'
  message: string
}

// Container states for each account (using container names as keys)
const containerStates = reactive<Record<string, ContainerState>>({
  'bansi': { isLoading: false, isStarting: false, isStopping: false },
  'cis': { isLoading: false, isStarting: false, isStopping: false },
  'hediye': { isLoading: false, isStarting: false, isStopping: false },
  'ovlg': { isLoading: false, isStarting: false, isStopping: false },
  'sc': { isLoading: false, isStarting: false, isStopping: false },
  'stamp': { isLoading: false, isStarting: false, isStopping: false },
  'vk': { isLoading: false, isStarting: false, isStopping: false }
})

// Notifications
const notifications = ref<Notification[]>([])
let notificationIdCounter = 0

const DOCKER_CONTROL_URL = 'https://ibkr-docker-manage.aiworkspace.pro/docker_control.php'

// Function to get URL parameters
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('all_cts_clientId')
}

// Function to extract client number from URL parameter
function extractClientNumber(clientParam: string | null): number | null {
  if (!clientParam) return null
  const match = clientParam.match(/Client\s*(\d+)/i)
  return match ? parseInt(match[1]) : null
}

// Watch for URL changes
onMounted(() => {
  selectedClientFromUrl.value = getUrlParams()
  
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', () => {
    selectedClientFromUrl.value = getUrlParams()
  })
})

// Historical data query - directly in component
const supabase = useSupabase()

// NLV History Query
const nlvHistoryQuery = useQuery({
  queryKey: computed(() => ['nlvHistory', selectedAccountForHistory.value]),
  queryFn: async () => {
    if (!selectedAccountForHistory.value) return []
    
    console.log('🔍 Querying NLV history for account:', selectedAccountForHistory.value)
    
    const { data, error } = await supabase
      .schema('hf')
      .from('netliquidation')
      .select('internal_account_id, fetched_at, nlv')
      .eq('internal_account_id', selectedAccountForHistory.value)
      .gte('fetched_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('fetched_at', { ascending: true })

    if (error) {
      console.error('❌ NLV history query error:', error)
      throw error
    }

    console.log('✅ NLV history query success:', data?.length, 'records')
    return data || []
  },
  staleTime: 60_000,
  enabled: computed(() => !!selectedAccountForHistory.value && selectedGraphType.value === 'nlv')
})

// Maintenance Margin History Query
const maintenanceHistoryQuery = useQuery({
  queryKey: computed(() => ['maintenanceHistory', selectedAccountForHistory.value]),
  queryFn: async () => {
    if (!selectedAccountForHistory.value) return []
    
    console.log('🔍 Querying Maintenance Margin history for account:', selectedAccountForHistory.value)
    
    const { data, error } = await supabase
      .schema('hf')
      .from('maintenance_margin')
      .select('internal_account_id, fetched_at, maintenance')
      .eq('internal_account_id', selectedAccountForHistory.value)
      .gte('fetched_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('fetched_at', { ascending: true })

    if (error) {
      console.error('❌ Maintenance Margin history query error:', error)
      throw error
    }

    console.log('✅ Maintenance Margin history query success:', data?.length, 'records')
    return data || []
  },
  staleTime: 60_000,
  enabled: computed(() => !!selectedAccountForHistory.value && selectedGraphType.value === 'mm')
})

// Helper function to format numbers as currency
function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Function to toggle graph visibility
function toggleGraph(accountId: number, type: 'nlv' | 'mm') {
  console.log('🔄 Toggle graph called:', { accountId, type })
  
  if (!graphVisibility[accountId]) {
    graphVisibility[accountId] = { nlv: false, mm: false }
  }
  
  const wasVisible = graphVisibility[accountId][type]
  
  // Close all other graphs first
  Object.keys(graphVisibility).forEach(id => {
    const numId = parseInt(id)
    if (graphVisibility[numId]) {
      graphVisibility[numId].nlv = false
      graphVisibility[numId].mm = false
    }
  })
  
  // Toggle the clicked graph
  graphVisibility[accountId][type] = !wasVisible
  
  // Set the selected account and graph type for history query
  if (graphVisibility[accountId][type]) {
    console.log('📊 Setting selected account for history:', accountId, 'type:', type)
    selectedAccountForHistory.value = accountId
    selectedGraphType.value = type
  } else {
    console.log('❌ Clearing selected account for history')
    selectedAccountForHistory.value = null
    selectedGraphType.value = null
  }
  
  console.log('📈 Graph visibility state:', graphVisibility)
  console.log('🎯 Selected account for history:', selectedAccountForHistory.value, 'type:', selectedGraphType.value)
}

// Get the appropriate query based on selected type
const currentHistoryQuery = computed(() => {
  if (selectedGraphType.value === 'nlv') {
    return nlvHistoryQuery
  } else if (selectedGraphType.value === 'mm') {
    return maintenanceHistoryQuery
  }
  return null
})

// Chart.js data and options
const chartData = computed(() => {
  const query = currentHistoryQuery.value
  if (!query?.data.value?.length) return null
  
  const data = query.data.value
  const labels = data.map(item => new Date(item.fetched_at).toLocaleDateString())
  
  const isNlv = selectedGraphType.value === 'nlv'
  const values = data.map(item => isNlv ? item.nlv : item.maintenance)
  
  return {
    labels,
    datasets: [
      {
        label: isNlv ? 'Net Liquidation Value' : 'Maintenance Margin',
        data: values,
        borderColor: isNlv ? '#3b82f6' : '#f59e0b',
        backgroundColor: isNlv ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
        fill: true
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const
    },
    title: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return formatCurrency(context.parsed.y)
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Date'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Value'
      },
      ticks: {
        callback: function(value: any) {
          return formatCurrency(value)
        }
      }
    }
  }
}))

function calculateGmax(nlv: number, maintenance_margin_caled_m: number, drop_called_d: number): number {
  const part1 = 1 - drop_called_d;
  const part2 = 1 - maintenance_margin_caled_m;
  const part3 = part1 * part2;
  const part4 = 1 - part3;
  const part5 = nlv / part4;
  return part5;
}

const calculatedMetrics = computed(() => {
  if (!q.data.value) return [];
  return q.data.value.map(item => {
    const maxGmvNlvSide = calculateGmax(item.nlv_val, 0.30, 0.15);
    const maxGmvMaintenanceSide = calculateGmax(item.nlv_val, 0.30, 0.10);
    const mkNlvSide = (maxGmvNlvSide * 30) / 100;
    const mkMaintenanceSide = (maxGmvMaintenanceSide * 30) / 100;
    const maintnanceMarginHeadroomNlvSide = mkNlvSide - item.maintenance_val;
    const maintnanceMarginHeadroomMaintenanceSide = mkMaintenanceSide - item.maintenance_val;
    const addlGmvAllowedNlvSide = (maintnanceMarginHeadroomNlvSide * 100) / 30;
    const addlGmvAllowedMaintenanceSide = (maintnanceMarginHeadroomMaintenanceSide * 100) / 30;
    return {
      ...item,
      maxGmvNlvSide,
      maxGmvMaintenanceSide,
      mkNlvSide,
      mkMaintenanceSide,
      maintnanceMarginHeadroomNlvSide,
      maintnanceMarginHeadroomMaintenanceSide,
      addlGmvAllowedNlvSide,
      addlGmvAllowedMaintenanceSide
    };
  });
});

// Computed property for filtered metrics based on URL parameter
const filteredMetrics = computed(() => {
  if (!selectedClientFromUrl.value || !calculatedMetrics.value) {
    return calculatedMetrics.value;
  }
  
  const clientNumber = extractClientNumber(selectedClientFromUrl.value);
  if (clientNumber === null) {
    return calculatedMetrics.value;
  }
  
  // Find the specific client (assuming Client1 is index 0, Client2 is index 1, etc.)
  const targetIndex = clientNumber - 1;
  if (targetIndex >= 0 && targetIndex < calculatedMetrics.value.length) {
    return [calculatedMetrics.value[targetIndex]];
  }
  
  return calculatedMetrics.value;
});

const allAccountsSummary = computed(() => {
  if (!calculatedMetrics.value) return null;
  const totalNlv = calculatedMetrics.value.reduce((sum, item) => sum + (item.nlv_val || 0), 0);
  const totalMaintenance = calculatedMetrics.value.reduce((sum, item) => sum + (item.maintenance_val || 0), 0);
  
  const totalAddlGmvToStopReducing = calculatedMetrics.value.reduce((sum, item) => sum + (item.addlGmvAllowedNlvSide || 0), 0); 
  const totalAddlGmvToStartReducing = calculatedMetrics.value.reduce((sum, item) => sum + (item.addlGmvAllowedMaintenanceSide || 0), 0); 

  return {
    totalNlv: totalNlv,
    totalMaintenance: totalMaintenance,
    totalAddlGmvToStopReducing: totalAddlGmvToStopReducing,
    totalAddlGmvToStartReducing: totalAddlGmvToStartReducing
  };
});

function toggleBreakdown(clientId: number) {
  console.log('📋 toggleBreakdown called with ID:', clientId);
  console.log('📋 Current breakdownVisibility state:', breakdownVisibility);
  
  // Ensure the key is a number
  const numericClientId = typeof clientId === 'string' ? parseInt(clientId) : clientId;
  
  // Check if this breakdown is currently visible
  const wasVisible = breakdownVisibility[numericClientId];
  
  // Close all other breakdowns first (like the graph functionality)
  Object.keys(breakdownVisibility).forEach(id => {
    const numId = parseInt(id);
    breakdownVisibility[numId] = false;
  });
  
  // Toggle the clicked breakdown (if it wasn't visible, show it; if it was visible, keep it closed)
  breakdownVisibility[numericClientId] = !wasVisible;
  
  console.log('📋 Updated breakdownVisibility state:', breakdownVisibility);
  console.log('📋 breakdownVisibility[' + numericClientId + ']:', breakdownVisibility[numericClientId]);
}

// Add a computed property to help debug the breakdown filter
const breakdownItems = computed(() => {
  console.log('🔍 Computing breakdown items...');
  console.log('🔍 filteredMetrics:', filteredMetrics.value);
  console.log('🔍 breakdownVisibility:', breakdownVisibility);
  
  const items = filteredMetrics.value?.filter(item => {
    // Convert string to number for consistent comparison
    const accountId = typeof item.nlv_internal_account_id === 'string' 
      ? parseInt(item.nlv_internal_account_id) 
      : item.nlv_internal_account_id;
    
    const shouldShow = breakdownVisibility[accountId];
    console.log('🔍 Item', accountId, '(original:', item.nlv_internal_account_id, ') should show:', shouldShow);
    return shouldShow;
  }) || [];
  
  console.log('🔍 Final breakdown items:', items);
  return items;
});

// Event bus for communication between components
const eventBus = inject('eventBus');

function updateClientInRoute(userAccountId: number) {
  const clientIndex = calculatedMetrics.value?.findIndex(item => parseInt(item.nlv_internal_account_id) === userAccountId) ?? -1;
  const clientNumber = clientIndex + 1;
  
  const url = new URL(window.location.href);
  url.searchParams.set('all_cts_clientId', 'Client ' + clientNumber.toString());
  window.history.replaceState({}, '', url.toString());
  
  // Update the local state
  selectedClientFromUrl.value = 'Client ' + clientNumber.toString();
  
  eventBus?.emit('client-id-changed', {
    clientId: 'Client ' + clientNumber.toString(),
    accountId: userAccountId
  });
}

function showAllAccounts() {
  const url = new URL(window.location.href);
  url.searchParams.delete('all_cts_clientId');
  window.history.replaceState({}, '', url.toString());
  
  // Update the local state
  selectedClientFromUrl.value = null;
  
  eventBus?.emit('client-id-changed', {
    clientId: null,
    accountId: null
  });
}

// Column definitions for ag-Grid
const columnDefs = computed<ColDef[]>(() => [
  {
    headerName: 'Account',
    field: 'account',
    valueGetter: (params) => {
      if (params.data.isTotal) return 'All Accounts';
      const accountId = typeof params.data.nlv_internal_account_id === 'string' 
        ? parseInt(params.data.nlv_internal_account_id) 
        : params.data.nlv_internal_account_id;
      const index = calculatedMetrics.value?.findIndex(m => {
        const mAccountId = typeof m.nlv_internal_account_id === 'string' 
          ? parseInt(m.nlv_internal_account_id) 
          : m.nlv_internal_account_id;
        return mAccountId === accountId;
      }) ?? -1;
      return `Client${index + 1}`;
    },
    pinned: 'left',
    width: 95,
    cellRenderer: (params) => {
      if (params.data.isTotal) {
        return `<div class="account-cell total-row">
          <span class="account-name">${params.value}</span>
        </div>`;
      }
      
      const status = params.data.addlGmvAllowedNlvSide < 0 && params.data.addlGmvAllowedMaintenanceSide < 0 
        ? 'STAGE 2 EXHAUSTED' 
        : (params.data.addlGmvAllowedNlvSide < 0 ? 'STAGE 1 EXHAUSTED' : 'OK');
      const statusClass = status === 'STAGE 2 EXHAUSTED' ? 'status-stage2' : 
                         status === 'STAGE 1 EXHAUSTED' ? 'status-stage1' : 'status-ok';
      return `<div class="account-cell">
        <span class="account-name">${params.value}</span>
        <span class="status-badge ${statusClass}">${status}</span>
      </div>`;
    }
  },
  {
    headerName: 'NLV',
    field: 'nlv_val',
    valueFormatter: (params) => formatCurrency(params.value),
    cellClass: 'number-cell',
    headerClass: 'graph-header',
    flex: 1,
    cellRenderer: (params) => {
      if (params.data.isTotal) {
        return `<span class="cell-value total-cell">${formatCurrency(params.value)}</span>`;
      }
      const accountId = typeof params.data.nlv_internal_account_id === 'string' 
        ? parseInt(params.data.nlv_internal_account_id) 
        : params.data.nlv_internal_account_id;
      const isActive = graphVisibility[accountId]?.nlv;
      return `<div class="cell-with-graph">
        <span class="cell-value">${formatCurrency(params.value)}</span>
      </div>`;
    }
  },
  {
    headerName: 'Maintenance Margin',
    field: 'maintenance_val',
    valueFormatter: (params) => formatCurrency(params.value),
    cellClass: 'number-cell',
    headerClass: 'graph-header',
    flex: 1,
    cellRenderer: (params) => {
      if (params.data.isTotal) {
        return `<span class="cell-value total-cell">${formatCurrency(params.value)}</span>`;
      }
      const accountId = typeof params.data.nlv_internal_account_id === 'string' 
        ? parseInt(params.data.nlv_internal_account_id) 
        : params.data.nlv_internal_account_id;
      const isActive = graphVisibility[accountId]?.mm;
      return `<div class="cell-with-graph">
        <span class="cell-value">${formatCurrency(params.value)}</span>
      </div>`;
    }
  },
  {
    headerName: "Add'l GMV to Stop-Reducing Cap",
    field: 'addlGmvAllowedNlvSide',
    valueFormatter: (params) => formatCurrency(params.value),
    cellClass: (params) => {
      const baseClass = 'number-cell';
      if (params.data.isTotal) return `${baseClass} total-cell`;
      return params.value < 0 ? `${baseClass} negative` : baseClass;
    },
    flex: 1
  },
  {
    headerName: "Add'l GMV to Start-Reducing Cap",
    field: 'addlGmvAllowedMaintenanceSide',
    valueFormatter: (params) => formatCurrency(params.value),
    cellClass: (params) => {
      const baseClass = 'number-cell';
      if (params.data.isTotal) return `${baseClass} total-cell`;
      return params.value < 0 ? `${baseClass} negative` : baseClass;
    },
    flex: 1
  },
]);

// Grid ready handler
function onGridReady(event: any) {
  gridApi.value = event.api;
  columnApiRef.value = event.columnApi;
  
  // Add click event listeners for buttons using the grid container element
  const gridElement = document.querySelector('.summary-ag-grid .ag-root-wrapper');
  if (gridElement) {
    gridElement.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Hide context menu on any click
      hideContextMenu()
      
      if (target.classList.contains('graph-btn')) {
        const accountId = parseInt(target.getAttribute('data-account') || '0');
        const type = target.getAttribute('data-type') as 'nlv' | 'mm';
        toggleGraph(accountId, type);
        // Refresh the grid to update button states
        if (gridApi.value && typeof gridApi.value.refreshCells === 'function') {
          gridApi.value.refreshCells();
        }
      }
      
      if (target.classList.contains('account-name') && !target.closest('.total-row')) {
        // For account name clicks, we need to find the account ID differently
        // Let's get it from the row data instead of trying to navigate DOM
        const rowNode = gridApi.value?.getDisplayedRowAtIndex(
          target.closest('.ag-row')?.getAttribute('row-index') || '0'
        );
        if (rowNode?.data && !rowNode.data.isTotal) {
          const accountId = typeof rowNode.data.nlv_internal_account_id === 'string' 
            ? parseInt(rowNode.data.nlv_internal_account_id) 
            : rowNode.data.nlv_internal_account_id;
          if (accountId) {
            updateClientInRoute(accountId);
          }
        }
      }
    });

    // Update right-click event listener to detect column
    gridElement.addEventListener('contextmenu', (event: Event) => {
      const target = event.target as HTMLElement;
      const cell = target.closest('.ag-cell');
      const row = target.closest('.ag-row');
      
      if (row && cell) {
        const rowIndex = row.getAttribute('row-index');
        const colId = cell.getAttribute('col-id');
        
        if (rowIndex !== null) {
          const rowNode = gridApi.value?.getDisplayedRowAtIndex(parseInt(rowIndex));
          if (rowNode?.data && !rowNode.data.isTotal) {
            const accountId = typeof rowNode.data.nlv_internal_account_id === 'string' 
              ? parseInt(rowNode.data.nlv_internal_account_id) 
              : rowNode.data.nlv_internal_account_id;
            if (accountId) {
              showContextMenu(event as MouseEvent, accountId, colId || undefined);
            }
          }
        }
      }
    });
  }
}

// Grid row data with totals
const gridRowData = computed(() => {
  if (!calculatedMetrics.value) return [];
  
  const data = [...filteredMetrics.value];
  
  // Add totals row if showing all accounts - move to bottom
  if (!selectedClientFromUrl.value && allAccountsSummary.value) {
    data.push({
      nlv_internal_account_id: -1,
      nlv_val: allAccountsSummary.value.totalNlv,
      maintenance_val: allAccountsSummary.value.totalMaintenance,
      addlGmvAllowedNlvSide: allAccountsSummary.value.totalAddlGmvToStopReducing,
      addlGmvAllowedMaintenanceSide: allAccountsSummary.value.totalAddlGmvToStartReducing,
      isTotal: true
    } as any);
  }
  
  return data;
});

// Add context menu state after your existing reactive variables
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  accountId: null as number | null,
  columnId: null as string | null, // Add column tracking
  fetchedAt: null as string | null // Add fetched_at tracking
})

// Add these missing context menu functions
function showContextMenu(event: MouseEvent, accountId: number, columnId?: string) {
  event.preventDefault()
  
  // Find the row data to get fetched_at_val
  const rowData = calculatedMetrics.value?.find(m => {
    const mAccountId = typeof m.nlv_internal_account_id === 'string' 
      ? parseInt(m.nlv_internal_account_id) 
      : m.nlv_internal_account_id;
    return mAccountId === accountId;
  });
  
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    accountId,
    columnId: columnId || null,
    fetchedAt: rowData?.fetched_at_val || null
  }
}

function hideContextMenu() {
  contextMenu.value.visible = false
}

function handleDetails() {
  if (contextMenu.value.accountId) {
    const accountId = contextMenu.value.accountId
    console.log('🔧 Details clicked for account:', accountId)
    
    // Find the item by nlv_internal_account_id (comparing as numbers)
    const item = calculatedMetrics.value?.find(m => {
      const mAccountId = typeof m.nlv_internal_account_id === 'string' 
        ? parseInt(m.nlv_internal_account_id) 
        : m.nlv_internal_account_id;
      return mAccountId === accountId;
    });
    
    console.log('📋 Found item for breakdown:', item);
    
    if (item) {
      console.log('🎯 Toggling breakdown for account ID:', accountId);
      toggleBreakdown(accountId);
    } else {
      console.warn('⚠️ No item found for account ID:', accountId);
    }
  }
  hideContextMenu()
}

// Add new context menu handlers for graphs
function handleNlvGraph() {
  if (contextMenu.value.accountId) {
    const accountId = contextMenu.value.accountId
    console.log('📊 NLV Graph clicked for account:', accountId)
    toggleGraph(accountId, 'nlv')
    
    // Refresh the grid to update button states
    if (gridApi.value && typeof gridApi.value.refreshCells === 'function') {
      gridApi.value.refreshCells();
    }
  }
  hideContextMenu()
}

function handleMaintenanceGraph() {
  if (contextMenu.value.accountId) {
    const accountId = contextMenu.value.accountId
    console.log('📊 Maintenance Margin Graph clicked for account:', accountId)
    toggleGraph(accountId, 'mm')
    
    // Refresh the grid to update button states
    if (gridApi.value && typeof gridApi.value.refreshCells === 'function') {
      gridApi.value.refreshCells();
    }
  }
  hideContextMenu()
}

// Helper function to check if a graph is active
function isGraphActive(accountId: number, type: 'nlv' | 'mm'): boolean {
  return graphVisibility[accountId]?.[type] || false
}

// Notification functions
function showNotification(type: 'success' | 'error', message: string) {
  const notification: Notification = {
    id: ++notificationIdCounter,
    type,
    message
  }
  
  notifications.value.push(notification)
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    removeNotification(notification.id)
  }, 4000)
}

function removeNotification(id: number) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Map account ID to container name
function getContainerNameFromAccountId(accountId: number): string | null {
  const mapping: Record<number, string> = {
    1: 'bansi',
    2: 'cis',
    3: 'hediye',
    4: 'ovlg',
    5: 'sc',
    6: 'stamp',
    7: 'vk'
  }
  return mapping[accountId] || null
}

// Docker container control - Start Container
async function startDockerContainer(containerName: string) {
  const currentState = containerStates[containerName]
  if (!currentState) {
    console.error(`Container state not found for: ${containerName}`)
    return
  }

  // Prevent multiple simultaneous requests
  if (currentState.isLoading) return

  const url = `${DOCKER_CONTROL_URL}?action=start&container_name=${containerName}`

  // Set loading state
  currentState.isLoading = true
  currentState.isStarting = true

  try {
    console.log(`Starting container: ${containerName}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Docker Start API Response:', data)

    if (data.status === 'success') {
      currentState.lastUpdated = new Date()
      console.log(`Container ${containerName} started successfully`)
      
      // Show success notification
      showNotification('success', `Container "${containerName}" started successfully!`)
      
      // Optional: Show the output for debugging
      if (data.output) {
        console.log('Start command output:', data.output)
      }
    } else {
      throw new Error(data.message || `Failed to start container`)
    }
  } catch (error) {
    console.error(`Error starting Docker container:`, error)
    showNotification('error', `Failed to start container "${containerName}". Check console for details.`)
  } finally {
    // Clear loading state
    currentState.isLoading = false
    currentState.isStarting = false
  }
}

// Docker container control - Stop Container
async function stopDockerContainer(containerName: string) {
  const currentState = containerStates[containerName]
  if (!currentState) {
    console.error(`Container state not found for: ${containerName}`)
    return
  }

  // Prevent multiple simultaneous requests
  if (currentState.isLoading) return

  const url = `${DOCKER_CONTROL_URL}?action=stop&container_name=${containerName}`

  // Set loading state
  currentState.isLoading = true
  currentState.isStopping = true
  
  try {
    console.log(`Stopping container: ${containerName}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Docker Stop API Response:', data)

    if (data.status === 'success') {
      currentState.lastUpdated = new Date()
      console.log(`Container ${containerName} stopped successfully`)
      
      // Show success notification
      showNotification('success', `Container "${containerName}" stopped successfully!`)
      
      // Optional: Show the output for debugging
      if (data.output) {
        console.log('Stop command output:', data.output)
      }
    } else {
      throw new Error(data.message || `Failed to stop container`)
    }
  } catch (error) {
    console.error(`Error stopping Docker container:`, error)
    showNotification('error', `Failed to stop container "${containerName}". Check console for details.`)
  } finally {
    // Clear loading state
    currentState.isLoading = false
    currentState.isStopping = false
  }
}

// Container polling functionality
const POLL_INTERVAL = 10_000  // 10 seconds
const POLL_TIMEOUT = 8000     // 8 seconds timeout
const pollTimers: number[] = []

// Helper function to get container state
function getContainerState(accountId: number): ContainerState {
  const containerName = getContainerNameFromAccountId(accountId)
  if (!containerName) {
    return { isLoading: false, isStarting: false, isStopping: false, online: false }
  }
  return containerStates[containerName] || { isLoading: false, isStarting: false, isStopping: false, online: false }
}

// Check container status by polling its API endpoint
async function checkContainer(accountId: number) {
  const containerName = getContainerNameFromAccountId(accountId)
  if (!containerName) return
  
  const state = containerStates[containerName]
  if (!state || state.isLoading) return
  
  state.isLoading = true
  state.lastError = null

  // Build the URL based on container name
  const url = containerName === 'vk' 
    ? `https://ibkr.vk.to5001.aiworkspace.pro/api/maintenance`
    : `https://ibkr.${containerName}.to5001.aiworkspace.pro/api/maintenance`
  
  const ac = new AbortController()
  const timeoutId = setTimeout(() => ac.abort(), POLL_TIMEOUT)

  try {
    const res = await fetch(url, { signal: ac.signal })
    if (!res.ok) {
      state.online = false
      state.lastError = `HTTP ${res.status}`
    } else {
      const data = await res.json().catch(() => null)
      if (data && data.account_id) {
        state.online = true
        state.lastUpdated = data.timestamp ? new Date(data.timestamp) : new Date()
        state.lastError = null
      } else {
        state.online = false
        state.lastError = 'missing account_id'
      }
    }
  } catch (err: any) {
    state.online = false
    state.lastError = String(err?.message || err)
  } finally {
    clearTimeout(timeoutId)
    state.isLoading = false
  }
}

// Schedule polling for all containers
function scheduleContainerPolling() {
  // Clear existing timers
  pollTimers.forEach(t => clearInterval(t))
  pollTimers.length = 0

  // Account IDs 1-7
  const accountIds = [1, 2, 3, 4, 5, 6, 7]
  
  accountIds.forEach((accountId, idx) => {
    // Initial staggered check
    setTimeout(() => { checkContainer(accountId) }, idx * 500)
    
    // Repeated checks
    const timerId = setInterval(() => checkContainer(accountId), POLL_INTERVAL)
    pollTimers.push(timerId as unknown as number)
  })
}

// Get container display info (online status and formatted last update)
function getContainerDisplay(accountId: number) {
  const state = getContainerState(accountId)
  return {
    online: !!state.online,
    lastUpdatedText: state.lastUpdated ? state.lastUpdated.toLocaleString() : '',
    isLoading: state.isLoading,
    lastError: state.lastError
  }
}

// Update your existing onMounted to add global click listener
onMounted(() => {
  selectedClientFromUrl.value = getUrlParams()
  
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', () => {
    selectedClientFromUrl.value = getUrlParams()
  })

  // Add global click listener to hide context menu
  document.addEventListener('click', hideContextMenu)
  
  // Start container polling
  scheduleContainerPolling()
})

// Update your existing onBeforeUnmount
onBeforeUnmount(() => {
  if (q._cleanup) {
    q._cleanup()
  }
  
  // Remove global click listener
  document.removeEventListener('click', hideContextMenu)
  
  // Stop container polling
  pollTimers.forEach(t => clearInterval(t))
  pollTimers.length = 0
})

// Add computed property to determine which menu items to show
const contextMenuItems = computed(() => {
  const items = [];
  
  // Always show Details
  items.push({
    icon: '📋',
    label: 'Details',
    action: 'details'
  });
  
  // Show NLV Graph only if clicked on NLV column
  if (contextMenu.value.columnId === 'nlv_val') {
    items.push({
      icon: '📊',
      label: 'NLV Graph',
      action: 'nlv-graph',
      active: contextMenu.value.accountId ? isGraphActive(contextMenu.value.accountId, 'nlv') : false
    });
  }
  
  // Show Maintenance Margin Graph only if clicked on maintenance margin column
  if (contextMenu.value.columnId === 'maintenance_val') {
    items.push({
      icon: '📈',
      label: 'Maintenance Margin Graph',
      action: 'mm-graph',
      active: contextMenu.value.accountId ? isGraphActive(contextMenu.value.accountId, 'mm') : false
    });
  }
  
  return items;
});

// Add context menu handler function
function handleContextMenuAction(action: string) {
  if (!contextMenu.value.accountId) return;
  
  switch (action) {
    case 'details':
      handleDetails();
      break;
    case 'nlv-graph':
      handleNlvGraph();
      break;
    case 'mm-graph':
      handleMaintenanceGraph();
      break;
  }
}

// Add a helper function to convert UTC to PST
function formatToPST(utcTimestamp: string | null): string {
  if (!utcTimestamp) return 'N/A';
  
  try {
    const date = new Date(utcTimestamp);
    
    // Convert to PST using Intl.DateTimeFormat
    const pstFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', // PST/PDT timezone
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 24-hour format
    });
    
    return pstFormatter.format(date);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid Date';
  }
}
</script>

<template>
  <!-- Success/Error Notifications -->
  <div class="notification-container">
    <div 
      v-for="notification in notifications" 
      :key="notification.id"
      class="notification"
      :class="notification.type"
    >
      <div class="notification-content">
        <span class="notification-icon">{{ notification.type === 'success' ? '✅' : '❌' }}</span>
        <span class="notification-message">{{ notification.message }}</span>
      </div>
      <button class="notification-close" @click="removeNotification(notification.id)">×</button>
    </div>
  </div>

  <div class="dashboard-container">
    <div v-if="q.isLoading.value" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading the latest metrics...</p>
    </div>

    <div v-else-if="q.isError.value" class="error">
      <h2>Error Loading Data</h2>
      <p>An error occurred while fetching the metrics:</p>
      <pre>{{ q.error.value }}</pre>
    </div>

    <div v-else-if="q.isSuccess.value">
      <div class="metric-block">
        <div class="block-header">
          <h2>
            <router-link v-if="showHeaderLink" to="/summary" class="summary-link">Summary</router-link>
            <span v-else>Summary</span>
          </h2>
          <button 
            @click="emit('minimize')"
            class="minimize-button"
            title="Minimize Summary"
          >
            −
          </button>
        </div>

        <!-- AG Grid Implementation - This should be the ONLY content -->
        <div class="ag-theme-alpine summary-grid">
          <AgGridVue
            :columnDefs="columnDefs"
            :rowData="gridRowData"
            :modules="[AllCommunityModule]"
            :defaultColDef="{
              resizable: true,
              sortable: true,
              filter: true
            }"
            :gridOptions="{
              domLayout: 'autoHeight',
              suppressMenuHide: true,
              enableBrowserTooltips: true,
              getRowStyle: (params) => {
                if (params.data.isTotal) {
                  return { 'font-weight': 'bold', 'background-color': '#f8f9fa' };
                }
                return null;
              }
            }"
            @grid-ready="onGridReady"
            class="summary-ag-grid"
          />
        </div>

        <!-- Chart.js Graph Display Section -->
        <div v-if="selectedAccountForHistory && selectedGraphType" class="graph-section">
          <div v-if="currentHistoryQuery?.isLoading.value" class="graph-loading">
            Loading {{ selectedGraphType === 'nlv' ? 'NLV' : 'Maintenance Margin' }} historical data...
          </div>
          <div v-else-if="currentHistoryQuery?.isError.value" class="graph-error">
            Error loading {{ selectedGraphType === 'nlv' ? 'NLV' : 'Maintenance Margin' }} historical data: {{ currentHistoryQuery.error.value }}
          </div>
          <div v-else-if="chartData" class="chart-section">
            <h4>
              {{ selectedGraphType === 'nlv' ? 'NLV' : 'Maintenance Margin' }} History
            </h4>
            <div class="chart-container">
              <Line 
                :data="chartData" 
                :options="chartOptions" 
                :height="300"
              />
            </div>
          </div>
          <div v-else class="graph-empty">
            No {{ selectedGraphType === 'nlv' ? 'NLV' : 'Maintenance Margin' }} historical data available
          </div>
        </div>

        <!-- Calculation Breakdown Section - Use computed property with debugging -->
        <div 
          v-for="item in breakdownItems" 
          :key="`breakdown-${typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id}`"
          class="calculation-breakdown"
        >
          <div class="breakdown-header">
            <div class="breakdown-header-left">
              <div>
                Calculation breakdown for Client{{ calculatedMetrics?.findIndex(m => {
                const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                return mAccountId === itemAccountId;
                }) + 1 }}:
              </div>
              <div>Assumptions: maintenance margin (m) = 30%</div>
            </div>
            
            <div class="breakdown-header-right">
              <div class="docker-control-section">
                <div class="container-status-badge" :class="getContainerDisplay(calculatedMetrics?.findIndex(m => {
                  const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                  const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                  return mAccountId === itemAccountId;
                }) + 1).online ? 'status-online' : 'status-offline'">
                  {{ getContainerDisplay(calculatedMetrics?.findIndex(m => {
                    const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                    const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                    return mAccountId === itemAccountId;
                  }) + 1).online ? '🟢 Online' : '🔴 Offline' }}
                </div>
                
                <button 
                  v-if="!getContainerDisplay(calculatedMetrics?.findIndex(m => {
                    const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                    const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                    return mAccountId === itemAccountId;
                  }) + 1).online"
                  class="docker-control-btn start-btn"
                  :disabled="containerStates[getContainerNameFromAccountId(calculatedMetrics?.findIndex(m => {
                    const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                    const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                    return mAccountId === itemAccountId;
                  }) + 1)]?.isLoading"
                  @click.stop="startDockerContainer(getContainerNameFromAccountId(calculatedMetrics?.findIndex(m => {
                    const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                    const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                    return mAccountId === itemAccountId;
                  }) + 1))"
                >
                  <span v-if="containerStates[getContainerNameFromAccountId(calculatedMetrics?.findIndex(m => {
                    const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                    const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                    return mAccountId === itemAccountId;
                  }) + 1)]?.isStarting">Starting...</span>
                  <span v-else>▶️ Start Container</span>
                </button>
                
                <button 
                  v-else
                  class="docker-control-btn stop-btn"
                  :disabled="containerStates[getContainerNameFromAccountId(calculatedMetrics?.findIndex(m => {
                    const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                    const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                    return mAccountId === itemAccountId;
                  }) + 1)]?.isLoading"
                  @click.stop="stopDockerContainer(getContainerNameFromAccountId(calculatedMetrics?.findIndex(m => {
                    const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                    const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                    return mAccountId === itemAccountId;
                  }) + 1))"
                >
                  <span v-if="containerStates[getContainerNameFromAccountId(calculatedMetrics?.findIndex(m => {
                    const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                    const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                    return mAccountId === itemAccountId;
                  }) + 1)]?.isStopping">Stopping...</span>
                  <span v-else>⏹️ Stop Container</span>
                </button>
              </div>
            </div>
          </div>
          <div class="breakdown-columns">
            <div class="breakdown-stage stage-1">
              <div class="stage-header">Stage-1 (drop d = 15%)</div>
              <div class="stage-item">
                <div class="item-label">Max GMV that survives stop-adding threshold</div>
                <div class="item-value">
                  <span class="formula">Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = {{ formatCurrency(item.maxGmvNlvSide) }}</span>
                </div>
              </div>
              <div class="stage-item">
                <div class="item-label">Max Maintenance margin (Before drop) to survive drop</div>
                <div class="item-value">
                  <span class="formula">Mk = Gmax x m = {{ formatCurrency(item.mkNlvSide) }}</span>
                </div>
              </div>
               <div class="stage-item">
                <div class="item-label">Maintenance margin headroom</div>
                <div class="item-value">
                  <span class="formula">Mk - M = {{ formatCurrency(item.maintnanceMarginHeadroomNlvSide) }}</span>
                </div>
              </div>
               <div class="stage-item">
                <div class="item-label">Add'l GMV allowed</div>
                <div class="item-value">
                  <span class="formula">(Mk - M) / m = {{ formatCurrency(item.addlGmvAllowedNlvSide) }}</span>
                </div>
              </div>
            </div>
            <div class="breakdown-stage stage-2">
              <div class="stage-header">Stage-2 (drop d = 10%)</div>
              <div class="stage-item">
                <div class="item-label">Max GMV that survives start-reducing threshold</div>
                <div class="item-value">
                  <span class="formula">Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = {{ formatCurrency(item.maxGmvMaintenanceSide) }}</span>
                </div>
              </div>
               <div class="stage-item">
                <div class="item-label">Max Maintenance margin (Before drop) to survive drop</div>
                <div class="item-value">
                  <span class="formula">Mk = Gmax x m = {{ formatCurrency(item.mkMaintenanceSide) }}</span>
                </div>
              </div>
               <div class="stage-item">
                <div class="item-label">Maintenance margin headroom</div>
                <div class="item-value">
                  <span class="formula">Mk - M = {{ formatCurrency(item.maintnanceMarginHeadroomMaintenanceSide) }}</span>
                </div>
              </div>
               <div class="stage-item">
                <div class="item-label">Add'l GMV allowed</div>
                <div class="item-value">
                  <span class="formula">(Mk - M) / m = {{ formatCurrency(item.addlGmvAllowedMaintenanceSide) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Updated Context Menu -->
        <div 
          v-if="contextMenu.visible" 
          class="context-menu"
          :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
          @click.stop
        >
          <div 
            v-for="(item, index) in contextMenuItems" 
            :key="item.action"
            class="context-menu-item" 
            :class="{ active: item.active }"
            @click="handleContextMenuAction(item.action)"
          >
            <span class="context-menu-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span v-if="item.active" class="active-indicator">●</span>
          </div>
          
          <!-- Add separator before fetched_at if there are menu items -->
          <div v-if="contextMenuItems.length > 0" class="context-menu-separator"></div>
          
          <!-- Show fetched_at_val at the bottom -->
          <div class="context-menu-info">
            <span class="context-menu-label">Fetched:</span>
            <span class="context-menu-value">
              {{ formatToPST(contextMenu.fetchedAt) }} (PST)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Notification System */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  min-width: 300px;
  backdrop-filter: blur(10px);
}

.notification.success {
  background: rgba(40, 167, 69, 0.95);
  color: white;
  border-left: 4px solid #28a745;
}

.notification.error {
  background: rgba(220, 53, 69, 0.95);
  color: white;
  border-left: 4px solid #dc3545;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.notification-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.notification-message {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* AG Grid Styles */
.summary-grid {
  margin-top: 1rem;
  height: auto;
  min-height: 200px;
}

.summary-ag-grid {
  font-family: inherit;
}

:deep(.ag-header-cell) {
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

:deep(.ag-cell) {
  border-bottom: 1px solid #e9ecef;
  padding: 0;
}

:deep(.ag-row:hover) {
  background-color: #f8f9fa;
}

:deep(.number-cell) {
  text-align: right;
  font-weight: 600;
}

:deep(.negative) {
  color: #dc3545;
}

:deep(.total-cell) {
  font-weight: 700;
  background-color: #f8f9fa;
}

:deep(.account-cell) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.account-name) {
  font-weight: 600;
  color: #1f2a37;
  cursor: pointer;
}

:deep(.account-name:hover) {
  color: #3b82f6;
}

:deep(.total-row .account-name) {
  cursor: default;
}

:deep(.total-row .account-name:hover) {
  color: #1f2a37;
}

:deep(.status-badge) {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 12px;
  text-transform: uppercase;
  align-self: flex-start;
}

:deep(.status-ok) {
  background-color: #d1fae5;
  color: #065f46;
}

:deep(.status-stage1) {
  background-color: #fef3c7;
  color: #92400e;
}

:deep(.status-stage2) {
  background-color: #fee2e2;
  color: #991b1b;
}

:deep(.cell-with-graph) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

:deep(.cell-value) {
  flex: 1;
}

:deep(.graph-btn) {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 2px 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

:deep(.graph-btn:hover) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

:deep(.graph-btn.active) {
  background-color: #dbeafe;
  border-color: #3b82f6;
  color: #1d4ed8;
}

/* Context Menu Styles */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  z-index: 1000;
  min-width: 200px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.15s ease;
  position: relative;
}

.context-menu-item:hover {
  background-color: #f3f4f6;
}

.context-menu-item.active {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.context-menu-item.active:hover {
  background-color: #bfdbfe;
}

.context-menu-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.context-menu-separator {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

.active-indicator {
  margin-left: auto;
  color: #10b981;
  font-size: 12px;
}

/* New styles for fetched_at info */
.context-menu-info {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
}

.context-menu-label {
  font-weight: 600;
  margin-bottom: 2px;
}

.context-menu-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #374151;
}

/* Chart styles */
.chart-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2a37;
  margin-bottom: 1rem;
}

.chart-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  height: 350px;
}

.graph-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.graph-loading, .graph-error, .graph-empty {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.graph-error {
  color: #dc2626;
}

/* Calculation breakdown styles */
.calculation-breakdown {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.breakdown-header {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.breakdown-header-left {
  flex: 1;
}

.breakdown-header-left div:first-child {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2a37;
  margin-bottom: 0.5rem;
}

.breakdown-header-left div:last-child {
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
}

.breakdown-header-right {
  display: flex;
  align-items: flex-start;
}

.docker-control-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.container-status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.container-status-badge.status-online {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.container-status-badge.status-offline {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

/* Docker control button styles */
.docker-control-btn {
  --success-clr: #28a745;
  --success-hover: #218838;
  --success-active: #1e7e34;
  --danger-clr: #dc3545;
  --danger-hover: #bb2d3b;
  --danger-active: #a52834;
  
  background: transparent;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 6px;
  cursor: pointer;
  line-height: 1.2;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.1s;
  min-width: 140px;
  border: 1px solid;
  white-space: nowrap;
}

.docker-control-btn.start-btn {
  border-color: var(--success-clr);
  color: var(--success-clr);
}

.docker-control-btn.start-btn:hover:not(:disabled) {
  background: var(--success-clr);
  color: white;
}

.docker-control-btn.start-btn:active {
  background: var(--success-active);
  border-color: var(--success-active);
  color: white;
  transform: translateY(1px);
}

.docker-control-btn.stop-btn {
  border-color: var(--danger-clr);
  color: var(--danger-clr);
}

.docker-control-btn.stop-btn:hover:not(:disabled) {
  background: var(--danger-clr);
  color: white;
}

.docker-control-btn.stop-btn:active {
  background: var(--danger-active);
  border-color: var(--danger-active);
  color: white;
  transform: translateY(1px);
}

.docker-control-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.docker-control-btn:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.35);
}

.breakdown-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.breakdown-stage {
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stage-1 {
  background-color: #fef3c7;
  border-color: #f59e0b;
}

.stage-2 {
  background-color: #fee2e2;
  border-color: #ef4444;
}

.stage-header {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2a37;
}

.stage-item {
  margin-bottom: 1rem;
}

.item-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.item-value {
  font-size: 0.85rem;
}

.formula {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #1f2937;
  font-weight: 600;
}

/* Keep all existing styles */
.dashboard-container {
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f6f8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  border-radius: 12px;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.block-header h2 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  color: #1f2a37;
}

.minimize-button {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  color: #6b7280;
  transition: all 0.2s;
  flex-shrink: 0;
}

.minimize-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
  transform: scale(1.05);
}

.minimize-button:active {
  transform: scale(0.95);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.summary-link {
  color: #1f2a37;
  text-decoration: none;
  transition: color 0.2s ease;
}

.summary-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .breakdown-columns {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    font-size: 0.875rem;
  }
}
</style>

<style>
.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.number-cell {
    border-right: var(--ag-pinned-column-border);
    padding: 0 2px;
}
</style>
