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

const q = useNlvMarginQuery(10, props.userId)

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
function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '$0'
  
  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  // Check if conversion resulted in NaN
  if (isNaN(numValue)) return '$0'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue)
}

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
    
    // Convert maintenance_val from string to number for calculations
    const maintenanceValue = typeof item.maintenance_val === 'string' 
      ? parseFloat(item.maintenance_val) 
      : item.maintenance_val;
    
    const maintnanceMarginHeadroomNlvSide = mkNlvSide - maintenanceValue;
    const maintnanceMarginHeadroomMaintenanceSide = mkMaintenanceSide - maintenanceValue;
    const addlGmvAllowedNlvSide = (maintnanceMarginHeadroomNlvSide * 100) / 30;
    const addlGmvAllowedMaintenanceSide = (maintnanceMarginHeadroomMaintenanceSide * 100) / 30;
    
    return {
      ...item,
      maintenance_val_numeric: maintenanceValue, // Add numeric version for calculations
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
  
  // Use the numeric version for totals calculation
  const totalMaintenance = calculatedMetrics.value.reduce((sum, item) => {
    const maintenanceValue = typeof item.maintenance_val === 'string' 
      ? parseFloat(item.maintenance_val) 
      : item.maintenance_val;
    return sum + (isNaN(maintenanceValue) ? 0 : maintenanceValue);
  }, 0);
  
  const totalExcessMaintenance = calculatedMetrics.value.reduce((sum, item) => sum + (item.excess_maintenance_margin || 0), 0);
  
  const totalAddlGmvToStopReducing = calculatedMetrics.value.reduce((sum, item) => sum + (item.addlGmvAllowedNlvSide || 0), 0); 
  const totalAddlGmvToStartReducing = calculatedMetrics.value.reduce((sum, item) => sum + (item.addlGmvAllowedMaintenanceSide || 0), 0); 

  return {
    totalNlv: totalNlv,
    totalMaintenance: totalMaintenance,
    totalExcessMaintenance: totalExcessMaintenance,
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

// Add column visibility management after the existing reactive variables
type SummaryColumnField = 'account' | 'nlv_val' | 'maintenance_val' | 'excess_maintenance_margin' | 'addlGmvAllowedNlvSide' | 'addlGmvAllowedMaintenanceSide'

const allSummaryColumnOptions: Array<{ field: SummaryColumnField; label: string }> = [
  { field: 'account', label: 'Account' },
  { field: 'nlv_val', label: 'NLV' },
  { field: 'maintenance_val', label: 'Maintenance Margin' },
  { field: 'excess_maintenance_margin', label: 'Excess Maintenance Margin' }, // Add this line
  { field: 'addlGmvAllowedNlvSide', label: "Add'l GMV to stop-adding threshold" },
  { field: 'addlGmvAllowedMaintenanceSide', label: "Add'l GMV to start-reducing threshold" }
]

// URL param helpers for column visibility
function parseSummaryVisibleColsFromUrl(): SummaryColumnField[] {
  const url = new URL(window.location.href)
  const colsParam = url.searchParams.get('summary_cols')
  if (!colsParam) {
    return allSummaryColumnOptions.map(c => c.field)
  }
  const fromUrl = colsParam.split('-and-').map(s => s.trim()).filter(Boolean) as SummaryColumnField[]
  const valid = new Set(allSummaryColumnOptions.map(c => c.field))
  const filtered = fromUrl.filter(c => valid.has(c))
  return filtered.length ? filtered : allSummaryColumnOptions.map(c => c.field)
}

function writeSummaryVisibleColsToUrl(cols: SummaryColumnField[]) {
  const url = new URL(window.location.href)
  url.searchParams.set('summary_cols', cols.join('-and-'))
  window.history.replaceState({}, '', url.toString())
}

const summaryVisibleCols = ref<SummaryColumnField[]>(parseSummaryVisibleColsFromUrl())

function isSummaryColVisible(field: SummaryColumnField): boolean {
  return summaryVisibleCols.value.includes(field)
}

// Column visibility controls
const showSummaryColumnsPopup = ref(false)
const summaryColumnsBtnRef = ref<HTMLElement | null>(null)
const summaryColumnsPopupRef = ref<HTMLElement | null>(null)

function toggleSummaryColumnsPopup() {
  showSummaryColumnsPopup.value = !showSummaryColumnsPopup.value
}

function closeSummaryColumnsPopup() {
  showSummaryColumnsPopup.value = false
}

// Close popup when clicking outside
function handleSummaryClickOutside(event: Event) {
  if (showSummaryColumnsPopup.value && 
      summaryColumnsPopupRef.value && 
      summaryColumnsBtnRef.value &&
      !summaryColumnsPopupRef.value.contains(event.target as Node) && 
      !summaryColumnsBtnRef.value.contains(event.target as Node)) {
    closeSummaryColumnsPopup()
  }
}

function setSummaryColumnVisibility(field: string, visible: boolean) {
  const api = gridApi.value
  if (!api) return
  
  try {
    if (typeof api.setColumnsVisible === 'function') {
      api.setColumnsVisible([field], visible)
    } else if (typeof api.setColumnVisible === 'function') {
      api.setColumnVisible(field, visible)
    }
  } catch (error) {
    console.warn('Could not set column visibility:', error)
  }
}

// Watch for column visibility changes and update grid
watch(summaryVisibleCols, (cols) => {
  writeSummaryVisibleColsToUrl(cols)
  for (const opt of allSummaryColumnOptions) {
    setSummaryColumnVisibility(opt.field, isSummaryColVisible(opt.field))
  }
}, { deep: true })

// Update column definitions to respect visibility
const columnDefs = computed<ColDef[]>(() => [
  {
    headerName: 'Account',
    field: 'account',
    valueGetter: (params) => {
      if (params.data.isTotal) return 'All Accounts';
      // Use legal_entity if available, otherwise fall back to Client# format
      if (params.data.legal_entity) {
        return params.data.legal_entity;
      }
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
    hide: !isSummaryColVisible('account'),
    onCellClicked: (event: any) => {
      // Don't allow filtering on total rows
      if (event.data?.isTotal) return
      handleSummaryAccountCellFilterClick(event?.value)
    },
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
      return `<div class="account-cell clickable-account">
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
    hide: !isSummaryColVisible('nlv_val'),
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
    valueFormatter: (params) => {
      // Convert string to number for formatting
      const value = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
      return formatCurrency(value);
    },
    cellClass: 'number-cell',
    headerClass: 'graph-header',
    flex: 1,
    hide: !isSummaryColVisible('maintenance_val'),
    cellRenderer: (params) => {
      if (params.data.isTotal) {
        return `<span class="cell-value total-cell">${formatCurrency(params.value)}</span>`;
      }
      const accountId = typeof params.data.nlv_internal_account_id === 'string' 
        ? parseInt(params.data.nlv_internal_account_id) 
        : params.data.nlv_internal_account_id;
      const isActive = graphVisibility[accountId]?.mm;
      
      // Convert string to number for display
      const value = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
      
      return `<div class="cell-with-graph">
        <span class="cell-value">${formatCurrency(value)}</span>
      </div>`;
    }
  },
  {
    headerName: 'Excess Maintenance Margin',
    field: 'excess_maintenance_margin',
    valueFormatter: (params) => formatCurrency(params.value),
    cellClass: (params) => {
      const baseClass = 'number-cell';
      if (params.data.isTotal) return `${baseClass} total-cell`;
      return params.value < 0 ? `${baseClass} negative` : baseClass;
    },
    flex: 1,
    hide: !isSummaryColVisible('excess_maintenance_margin')
  },
  {
    headerName: "Stop-adding threshold (Add'l GMV)",
    field: 'addlGmvAllowedNlvSide',
    valueFormatter: (params) => formatCurrency(params.value),
    cellClass: (params) => {
      const baseClass = 'number-cell';
      if (params.data.isTotal) return `${baseClass} total-cell`;
      return params.value < 0 ? `${baseClass} negative` : baseClass;
    },
    flex: 1,
    hide: !isSummaryColVisible('addlGmvAllowedNlvSide')
  },
  {
    headerName: "Start-reducing threshold (Add'l GMV)",
    field: 'addlGmvAllowedMaintenanceSide',
    valueFormatter: (params) => formatCurrency(params.value),
    cellClass: (params) => {
      const baseClass = 'number-cell';
      if (params.data.isTotal) return `${baseClass} total-cell`;
      return params.value < 0 ? `${baseClass} negative` : baseClass;
    },
    flex: 1,
    hide: !isSummaryColVisible('addlGmvAllowedMaintenanceSide')
  },
]);

// Grid ready handler
function onGridReady(event: any) {
  gridApi.value = event.api;
  columnApiRef.value = event.columnApi;
  
  // Apply initial filters from URL ONLY ONCE
  const initialFilters = parseFiltersFromUrl()
  if (initialFilters.account) {
    const filterModel = {
      account: { type: 'equals', filter: initialFilters.account }
    }
    event.api.setFilterModel(filterModel)
  }
  
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
  
  // Sync filters AFTER initial setup
  syncActiveSummaryFiltersFromGrid()
}

// Grid row data with totals
const gridRowData = computed(() => {
  if (!calculatedMetrics.value) return [];
  
  // Just return the filtered metrics without adding totals to the main data
  return filteredMetrics.value;
});

// Separate regular data from totals
const regularRowData = computed(() => {
  return filteredMetrics.value || [];
});

// Update the pinnedBottomRowData computed property to hide totals when filters are active
const pinnedBottomRowData = computed(() => {
  // Only show totals row when showing all accounts AND no filters are active
  if (!selectedClientFromUrl.value && allAccountsSummary.value && activeSummaryFilters.value.length === 0) {
    return [{
      nlv_internal_account_id: -1,
      nlv_val: allAccountsSummary.value.totalNlv,
      maintenance_val: allAccountsSummary.value.totalMaintenance,
      excess_maintenance_margin: allAccountsSummary.value.totalExcessMaintenance,
      addlGmvAllowedNlvSide: allAccountsSummary.value.totalAddlGmvToStopReducing,
      addlGmvAllowedMaintenanceSide: allAccountsSummary.value.totalAddlGmvToStartReducing,
      isTotal: true
    }];
  }
  return [];
});

// Add function to determine if row should be pinned
function isRowPinned(params: any) {
  return params.data?.isTotal ? 'bottom' : null;
}

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
  
  // Add global click listener for column selector
  document.addEventListener('click', handleSummaryClickOutside)
  
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
  document.removeEventListener('click', handleSummaryClickOutside)
  
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

// Add active filters tracking for tag UI (similar to Positions)
type ActiveSummaryFilter = { field: 'account'; value: string }
const activeSummaryFilters = ref<ActiveSummaryFilter[]>([])

function syncActiveSummaryFiltersFromGrid() {
  const api = gridApi.value
  const next: ActiveSummaryFilter[] = []
  
  if (api) {
    const model = api.getFilterModel?.() || {}
    const getFilterValue = (field: string) => model?.[field]?.filter || model?.[field]?.values || null
    
    const account = getFilterValue('account')
    if (typeof account === 'string' && account.length) {
      next.push({ field: 'account', value: account })
    }
  }
  
  activeSummaryFilters.value = next
}

function handleSummaryAccountCellFilterClick(value: any) {
  const api = gridApi.value
  if (!api || value === undefined || value === null) return
  
  // Use normal ag-Grid filters for account field
  const currentModel = (api.getFilterModel && api.getFilterModel()) || {}
  currentModel.account = { type: 'equals', filter: String(value) }
  
  if (typeof api.setFilterModel === 'function') {
    api.setFilterModel(currentModel)
  }
  if (typeof api.onFilterChanged === 'function') {
    api.onFilterChanged()
  }
  
  // Persist to URL
  writeFiltersToUrlFromModel(currentModel)
  
  syncActiveSummaryFiltersFromGrid()
}

function clearSummaryFilter(field: 'account') {
  const api = gridApi.value
  if (!api) return
  
  // Clear ag-Grid filter for the field
  const currentModel = (api.getFilterModel && api.getFilterModel()) || {}
  delete currentModel[field]
  
  if (typeof api.setFilterModel === 'function') {
    api.setFilterModel(currentModel)
  }
  if (typeof api.onFilterChanged === 'function') {
    api.onFilterChanged()
  }
  
  // Persist to URL
  writeFiltersToUrlFromModel(currentModel)
  
  syncActiveSummaryFiltersFromGrid()
}

function clearAllSummaryFilters() {
  const api = gridApi.value
  if (!api) return
  
  // Clear all ag-Grid filters
  if (typeof api.setFilterModel === 'function') {
    api.setFilterModel({})
  }
  if (typeof api.onFilterChanged === 'function') {
    api.onFilterChanged()
  }
  
  // Persist to URL
  writeFiltersToUrlFromModel({})
  
  syncActiveSummaryFiltersFromGrid()
}

// Update the grid watcher to prevent infinite loops
let isUpdatingFromUrl = false

watch(() => gridApi.value, (api) => {
  if (!api) return
  
  const listener = () => {
    if (!isUpdatingFromUrl) {
      syncActiveSummaryFiltersFromGrid()
      // Persist filter model to URL
      const model = api.getFilterModel?.() || {}
      writeFiltersToUrlFromModel(model)
    }
  }
  
  api.addEventListener?.('filterChanged', listener)
}, { immediate: true })

// Add URL parameter handling functions (missing from your current code)
function parseFiltersFromUrl(): { account?: string } {
  const url = new URL(window.location.href)
  const account = url.searchParams.get('all_cts_clientId') || undefined
  return { account }
}

function writeFiltersToUrlFromModel(model: any) {
  const url = new URL(window.location.href)
  
  // Handle account filter
  const acc = model?.account?.filter || ''
  if (acc) {
    url.searchParams.set('all_cts_clientId', acc)
  } else {
    url.searchParams.delete('all_cts_clientId')
  }
  
  window.history.replaceState({}, '', url.toString())
}

// Add the missing graph toggle function
function toggleGraph(accountId: number, type: 'nlv' | 'mm') {
  console.log('📊 toggleGraph called with:', accountId, type)
  
  // Initialize if not exists
  if (!graphVisibility[accountId]) {
    graphVisibility[accountId] = { nlv: false, mm: false }
  }
  
  // If clicking the same graph that's already active, close it
  if (selectedAccountForHistory.value === accountId && selectedGraphType.value === type) {
    selectedAccountForHistory.value = null
    selectedGraphType.value = null
    graphVisibility[accountId][type] = false
    return
  }
  
  // Close all other graphs first
  Object.keys(graphVisibility).forEach(id => {
    const numId = parseInt(id)
    graphVisibility[numId] = { nlv: false, mm: false }
  })
  
  // Set new graph
  graphVisibility[accountId][type] = true
  selectedAccountForHistory.value = accountId
  selectedGraphType.value = type
  
  console.log('📊 Graph visibility updated:', graphVisibility)
  console.log('📊 Selected account/type:', accountId, type)
}

// Add the missing computed properties for chart data
const currentHistoryQuery = computed(() => {
  if (selectedGraphType.value === 'nlv') {
    return nlvHistoryQuery
  } else if (selectedGraphType.value === 'mm') {
    return maintenanceHistoryQuery
  }
  return null
})

const chartData = computed(() => {
  const query = currentHistoryQuery.value
  if (!query?.data.value || !Array.isArray(query.data.value)) return null
  
  const data = query.data.value
  const labels = data.map(item => {
    const date = new Date(item.fetched_at)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  
  const values = selectedGraphType.value === 'nlv' 
    ? data.map(item => parseFloat(item.nlv) || 0)
    : data.map(item => parseFloat(item.maintenance) || 0)
  
  return {
    labels,
    datasets: [{
      label: selectedGraphType.value === 'nlv' ? 'NLV' : 'Maintenance Margin',
      data: values,
      borderColor: selectedGraphType.value === 'nlv' ? '#3b82f6' : '#ef4444',
      backgroundColor: selectedGraphType.value === 'nlv' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.1
    }]
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
      display: true,
      text: `${selectedGraphType.value === 'nlv' ? 'NLV' : 'Maintenance Margin'} History (Last 30 Days)`
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: function(value: any) {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
          }).format(value)
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index' as const
  }
}))

// ...existing code...
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
          <div class="header-tools">
            <button 
              ref="summaryColumnsBtnRef" 
              class="columns-btn" 
              aria-label="Column settings" 
              @click.stop="toggleSummaryColumnsPopup"
              title="Column Settings"
            >
              <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.21-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.22-.22-.39-.44-.39h-3.84c-.22 0-.41.16-.44.39l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c.04.31.06.63.06.94s-.02.63-.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.21.37.3.59.22l2.39.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.22.22.39.44.39h3.84c.22 0 .41-.16.44-.39l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.03-1.58ZM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5Z"/>
              </svg>
            </button>
            
            <button 
              @click="emit('minimize')"
              class="minimize-button"
              title="Minimize Summary"
            >
              −
            </button>
            
            <!-- Updated Column selector popup to match Positions design -->
            <div v-if="showSummaryColumnsPopup" ref="summaryColumnsPopupRef" class="columns-dropdown" @click.stop>
              <div class="columns-header">
                <span class="columns-title">Columns</span>
              </div>
              <div class="columns-content">
                <label v-for="opt in allSummaryColumnOptions" :key="opt.field" class="column-option">
                  <input 
                    type="checkbox" 
                    :value="opt.field" 
                    v-model="summaryVisibleCols"
                    class="column-checkbox"
                  />
                  <span class="column-label">{{ opt.label }}</span>
                </label>
              </div>
              <div class="columns-footer">
                <button 
                  class="btn-link" 
                  @click="summaryVisibleCols = allSummaryColumnOptions.map(c => c.field)"
                >
                  Show All
                </button>
                <button class="btn-done" @click="closeSummaryColumnsPopup">Done</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Active filters bar (similar to Positions) -->
        <div v-if="activeSummaryFilters.length" class="summary-filters-bar">
          <span class="filters-label">Filtered by:</span>
          <div class="filters-tags">
            <span v-for="f in activeSummaryFilters" :key="`${f.field}-${f.value}`" class="filter-tag">
              <strong>{{ f.field === 'account' ? 'Account' : f.field }}:</strong> {{ f.value }}
              <button class="tag-clear" @click="clearSummaryFilter(f.field)" aria-label="Clear filter">✕</button>
            </span>
            <button class="btn btn-clear-all" @click="clearAllSummaryFilters">Clear all</button>
          </div>
        </div>

        <!-- AG Grid Implementation - This should be the ONLY content -->
        <div class="ag-theme-alpine summary-grid">
          <AgGridVue
            :columnDefs="columnDefs"
            :rowData="regularRowData"
            :pinnedBottomRowData="pinnedBottomRowData"
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
                if (params.data?.isTotal) {
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
                Calculation breakdown for {{ item.legal_entity || `Client${calculatedMetrics?.findIndex(m => {
                const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
                const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
                return mAccountId === itemAccountId;
                }) + 1}` }}:
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

        <!-- Updated Context Menu with proper styling -->
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

/* Fix header layout to position tools on the right */
.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  /* padding: 0.5rem 0; */
}

.block-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.summary-link {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.summary-link:hover {
  color: #1d4ed8;
  text-decoration: none;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  margin-left: auto; /* This ensures the tools are pushed to the right */
}

.minimize-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  font-weight: bold;
}

.minimize-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.columns-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.columns-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.columns-btn .icon {
  pointer-events: none;
}

.columns-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 260px;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.columns-header {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.columns-title {
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.columns-content {
  padding: 4px 0;
  max-height: 300px;
  overflow-y: auto;
}

.column-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  margin: 0;
  font-size: 13px;
}

.column-option:hover {
  background-color: #f8f9fa;
}

.column-checkbox {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid #ccc;
  margin: 0;
  cursor: pointer;
  accent-color: #007bff;
}

.column-checkbox:checked {
  background-color: #007bff;
  border-color: #007bff;
}

.column-label {
  color: #333;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  line-height: 1.2;
}

.columns-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.btn-link {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: color 0.15s ease;
}

.btn-link:hover {
  color: #495057;
  text-decoration: underline;
}

.btn-done {
  background: #007bff;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-done:hover {
  background: #0056b3;
}

.btn-done:active {
  background: #004085;
}

/* Add these filter bar styles (similar to Positions) */
.summary-filters-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.filters-label {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 600;
}

.filters-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #fff;
  color: #495057;
  padding: 0.3rem 0.6rem;
  border-radius: 16px;
  border: 1px solid #dee2e6;
  font-size: 0.8125rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-tag .tag-clear {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6c757d;
  font-size: 0.875rem;
  padding: 0;
  margin-left: 0.25rem;
  transition: color 0.2s;
}

.filter-tag .tag-clear:hover {
  color: #dc3545;
}

.btn-clear-all {
  padding: 0.3rem 0.6rem;
  border-radius: 16px;
  border: 1px solid #dee2e6;
  background: #fff;

  color: #6c757d;
  cursor: pointer;
  font-size: 0.8125rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-clear-all:hover {
  background: #f8f9fa;
  color: #495057;
  border-color: #adb5bd;
}

/* Add clickable styling for account cells */
:deep(.clickable-account .account-name) {
  cursor: pointer;
  transition: color 0.2s;
}

:deep(.clickable-account .account-name:hover) {
  color: #007bff;
  text-decoration: underline;
}

/* Ensure total row account names are not clickable */
:deep(.total-row .account-name) {
  cursor: default;
}

:deep(.total-row .account-name:hover) {
  color: #1f2a37;
  text-decoration: none;
}

/* Context Menu Styles - Add these */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 4px 0;
  min-width: 220px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border: none;
  background: none;
}

.context-menu-item:hover {
  background-color: #f8fafc;
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
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.active-indicator {
  color: #10b981;
  font-size: 10px;
  margin-left: auto;
  font-weight: bold;
}

.context-menu-separator {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

.context-menu-info {
  padding: 8px 16px;
  background-color: #f8fafc;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #64748b;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
}

.context-menu-label {
  font-weight: 600;
  margin-right: 8px;
  color: #475569;
}

.context-menu-value {
  color: #1e293b;
}

/* Graph Section Styles */
.graph-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.graph-loading, .graph-error, .graph-empty {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-style: italic;
}

.graph-error {
  color: #dc2626;
}

.chart-section h4 {
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
}

.chart-container {
  height: 300px;
  background: white;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

/* Calculation Breakdown Styles - Restore the old design */
.calculation-breakdown {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.breakdown-header-left div:first-child {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.breakdown-header-left div:last-child {
  font-size: 0.875rem;
  color: #64748b;
  font-style: italic;
}

.breakdown-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.container-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-online {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-offline {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.docker-control-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-btn {
  background-color: #22c55e;
  color: white;
  border-color: #16a34a;
}

.start-btn:hover:not(:disabled) {
  background-color: #16a34a;
}

.stop-btn {
  background-color: #ef4444;
  color: white;
  border-color: #dc2626;
  width: auto;
}

.stop-btn:hover:not(:disabled) {
  background-color: #dc2626;
}

.docker-control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.breakdown-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.breakdown-stage {
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid;
}

.stage-1 {
  background-color: #fefce8;
  border-color: #eab308;
}

.stage-2 {
  background-color: #fef2f2;
  border-color: #ef4444;
}

.stage-header {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.stage-item {
  margin-bottom: 1rem;
}

.stage-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.item-value {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  color: #1e293b;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.formula {
  font-weight: 500;
}
</style>

<style>
.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.number-cell {
    border-right: var(--ag-pinned-column-border);
    padding: 0 2px;
}
</style>