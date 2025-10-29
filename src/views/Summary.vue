<script setup lang="ts">
// 1. REPLACE AG Grid imports with Tabulator
import { TabulatorFull as Tabulator } from 'tabulator-tables'
// REMOVE these AG Grid imports:
// import { AgGridVue } from 'ag-grid-vue3'
// import { AllCommunityModule } from 'ag-grid-community'
// import type { ColDef, GridApi, ColumnApi } from 'ag-grid-community'
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'

import { onMounted, onBeforeUnmount, computed, reactive, inject, ref, watch, nextTick } from 'vue'
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
import html2canvas from 'html2canvas'
import AddClientDialog from '../components/AddClientDialog.vue'

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
  userId: null,
  window: null
  //userId: "67e578fd-2cf7-48a4-b028-a11a3f89bb9b"
})

const emit = defineEmits<{
  'minimize': []
}>()

// 2. REPLACE grid refs
const tableDiv = ref<HTMLDivElement | null>(null)
let tabulator: Tabulator | null = null

// REMOVE these:
// const gridApi = ref<GridApi | null>(null)
// const columnApiRef = ref<ColumnApi | null>(null)
const showArchivedClients = ref(false)
//const q = useNlvMarginQuery(10, props.userId)
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
  'vk': { isLoading: false, isStarting: false, isStopping: false },
  'jkmdm': { isLoading: false, isStarting: false, isStopping: false }
})

// Notifications
const notifications = ref<Notification[]>([])
let notificationIdCounter = 0

const DOCKER_CONTROL_URL = 'https://ibkr-docker-manage.aiworkspace.pro/docker_control.php'

// Function to get URL parameters
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(`${props.window}_all_cts_clientId`)
}

// Function to extract client number from URL parameter
function extractClientNumber(clientParam: string | null): number | null
{
  if (!clientParam) return null
  const match = clientParam.match(/Client\s*(\d+)/i)
  return match ? parseInt(match[1]) : null
}

const appName = ref('Summary')
const showAppNameDialog = ref(false)
const appNameInput = ref('')

function parseAppNameFromUrl(): string {
  const url = new URL(window.location.href)
  return url.searchParams.get(`${props.window}_summary_app_name`) || 'Summary'
}

function writeAppNameToUrl(name: string) {
  const url = new URL(window.location.href)
  if (name && name.trim() && name !== 'Summary') {
    url.searchParams.set(`${props.window}_summary_app_name`, name.trim())
  } else {
    url.searchParams.delete(`${props.window}_summary_app_name`)
  }
  window.history.replaceState({}, '', url.toString())
}

function openAppNameDialog() {
  appNameInput.value = appName.value
  showAppNameDialog.value = true
}

function saveAppName() {
  appName.value = appNameInput.value.trim() || 'Summary'
  writeAppNameToUrl(appName.value)
  showAppNameDialog.value = false
}

// Watch for URL changes
onMounted(() => {
  selectedClientFromUrl.value = getUrlParams()
  appName.value = parseAppNameFromUrl()
  
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', () => {
    selectedClientFromUrl.value = getUrlParams()
    appName.value = parseAppNameFromUrl()
  })
})

// Historical data query - directly in component
const supabase = useSupabase()
const queryClient = useQueryClient()

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

const showAddClientDialog = ref(false)
function handleClientAdded() {
  showAddClientDialog.value = false
  queryClient.invalidateQueries() // refresh summary data
}
function openAddClientDialog() {
  showAddClientDialog.value = true
}

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
  // Always filter by archived status first
  let metrics = calculatedMetrics.value || [];
  metrics = metrics.filter(item => {
    if (showArchivedClients.value) return item.archived === true;
    return item.archived !== true;
  });
  console.log('Archived only:', metrics)

  // Then filter by selected client from URL if present
  if (!selectedClientFromUrl.value) {
    return metrics;
  }

  const clientNumber = extractClientNumber(selectedClientFromUrl.value);
  if (clientNumber === null) {
    return metrics;
  }

  // Find the specific client (assuming Client1 is index 0, Client2 is index 1, etc.)
  const targetIndex = clientNumber - 1;
  if (targetIndex >= 0 && targetIndex < metrics.length) {
    return [metrics[targetIndex]];
  }

  return metrics;
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
  url.searchParams.set(`${props.window}_all_cts_clientId`, 'Client ' + clientNumber.toString());
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
  url.searchParams.delete(`${props.window}_all_cts_clientId`);
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
  const colsParam = url.searchParams.get(`${props.window}_summary_cols`)
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
  url.searchParams.set(`${props.window}_summary_cols`, cols.join('-and-'))
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

// Watch for column visibility changes and update grid
watch(summaryVisibleCols, (cols) => {
  writeSummaryVisibleColsToUrl(cols)
  
  // Rebuild table instead of trying to show/hide columns
  nextTick(() => {
    initializeTabulator()
  })
}, { deep: true })

// 3. ADD Tabulator initialization function (REPLACE onGridReady)
function initializeTabulator() {
  if (!tableDiv.value) return

  if (tabulator) {
    try { tabulator.destroy() } catch (error) {}
    tabulator = null
  }

  const columns = [
    {
      title: 'Account',
      field: 'account',
      frozen: true,
      headerSort: false,
      width: summaryColumnWidths.value['account'] || undefined, // Apply saved width
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data.isTotal) {
          return `<div class="account-cell total-row">
            <span class="account-name">All Accounts</span>
          </div>`
        }
        const status = data.addlGmvAllowedNlvSide < 0 && data.addlGmvAllowedMaintenanceSide < 0 
          ? 'STAGE 2 EXHAUSTED' 
          : (data.addlGmvAllowedNlvSide < 0 ? 'STAGE 1 EXHAUSTED' : 'OK')
        const statusClass = status === 'STAGE 2 EXHAUSTED' ? 'status-stage2' : 
                           status === 'STAGE 1 EXHAUSTED' ? 'status-stage1' : 'status-ok'

        let html = `<span class="account-name">${data.legal_entity || data.account}</span>
        <span class="status-badge ${statusClass}">${status}</span>`
        if (manualSyncAccounts.value.has(data.nlv_internal_account_id)) {
          html += `<button class="edit-btn" data-id="${data.nlv_internal_account_id}">✏️</button>`
        }

        return `<div class="account-cell clickable-account">${html}</div>`
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>Account</span>
        </div>`
      },
      cellClick: (e: any, cell: any) => {
        const data = cell.getRow().getData()
        if (e.target.classList.contains('edit-btn')) {
          openEditModal(data.nlv_internal_account_id, data.nlv_val, data.maintenance_val)
        } else if (!data.isTotal) {
          handleSummaryAccountCellFilterClick(data.account)
        }
      }
    },
    {
      title: 'NLV',
      field: 'nlv_val',
      hozAlign: 'right',
      width: summaryColumnWidths.value['nlv_val'] || undefined, // Apply saved width
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        const value = formatCurrency(cell.getValue())
        if (data.isTotal) {
          return `<span class="cell-value total-cell">${value}</span>`
        }
        return `<div class="cell-with-graph">
          <span class="cell-value">${value}</span>
        </div>`
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>NLV</span>
          <button class="header-close-btn" data-field="nlv_val" title="Hide column">✕</button>
        </div>`
      },
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => formatCurrency(cell.getValue())
    },
    {
      title: 'Maintenance Margin',
      field: 'maintenance_val',
      hozAlign: 'right',
      width: summaryColumnWidths.value['maintenance_val'] || undefined, // Apply saved width
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        const value = typeof cell.getValue() === 'string' ? parseFloat(cell.getValue()) : cell.getValue()
        const formatted = formatCurrency(value)
        if (data.isTotal) {
          return `<span class="cell-value total-cell">${formatted}</span>`
        }
        return `<div class="cell-with-graph">
          <span class="cell-value">${formatted}</span>
        </div>`
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>Maintenance Margin</span>
          <button class="header-close-btn" data-field="maintenance_val" title="Hide column">✕</button>
        </div>`
      },
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => {
        const value = typeof cell.getValue() === 'string' ? parseFloat(cell.getValue()) : cell.getValue()
        return formatCurrency(value)
      }
    },
    {
      title: 'Excess Maintenance Margin',
      field: 'excess_maintenance_margin',
      hozAlign: 'right',
      width: summaryColumnWidths.value['excess_maintenance_margin'] || undefined, // Apply saved width
      formatter: (cell: any) => {
        const value = cell.getValue()
        const formatted = formatCurrency(value)
        const isNegative = value < 0
        return `<span class="${isNegative ? 'negative' : ''}">${formatted}</span>`
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>Excess Maintenance Margin</span>
          <button class="header-close-btn" data-field="excess_maintenance_margin" title="Hide column">✕</button>
        </div>`
      },
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => formatCurrency(cell.getValue())
    },
    {
      title: "Stop-adding threshold (Add'l GMV)",
      field: 'addlGmvAllowedNlvSide',
      hozAlign: 'right',
      width: summaryColumnWidths.value['addlGmvAllowedNlvSide'] || undefined, // Apply saved width
      formatter: (cell: any) => {
        const value = cell.getValue()
        const formatted = formatCurrency(value)
        const isNegative = value < 0
        return `<span class="${isNegative ? 'negative' : ''}">${formatted}</span>`
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>Stop-adding threshold (Add'l GMV)</span>
          <button class="header-close-btn" data-field="addlGmvAllowedNlvSide" title="Hide column">✕</button>
        </div>`
      },
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => formatCurrency(cell.getValue())
    },
    {
      title: "Start-reducing threshold (Add'l GMV)",
      field: 'addlGmvAllowedMaintenanceSide',
      hozAlign: 'right',
      width: summaryColumnWidths.value['addlGmvAllowedMaintenanceSide'] || undefined, // Apply saved width
      formatter: (cell: any) => {
        const value = cell.getValue()
        const formatted = formatCurrency(value)
        const isNegative = value < 0
        return `<span class="${isNegative ? 'negative' : ''}">${formatted}</span>`
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>Start-reducing threshold (Add'l GMV)</span>
          <button class="header-close-btn" data-field="addlGmvAllowedMaintenanceSide" title="Hide column">✕</button>
        </div>`
      },
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => formatCurrency(cell.getValue())
    }
  ].filter(col => summaryVisibleCols.value.includes(col.field as SummaryColumnField))

  try {
    tabulator = new Tabulator(tableDiv.value, {
      data: gridRowData.value,
      columns,
      layout: 'fitColumns',
      height: 'auto',
      placeholder: 'No data available',
      columnDefaults: {
        resizable: true,
        headerSort: true
      },
      rowFormatter: (row: any) => {
        const data = row.getData()
        const element = row.getElement()
        if (data.isTotal && element) {
          element.style.backgroundColor = '#f8f9fa'
          element.style.fontWeight = 'bold'
        }
      }
    })

    // Add event listener for column resize
    tabulator.on('columnResized', (column: any) => {
      const field = column.getField()
      const width = column.getWidth()
      
      // Update the stored widths
      summaryColumnWidths.value[field] = width
      
      // Save to URL
      writeSummaryColumnWidthsToUrl(summaryColumnWidths.value)
    })

    // Add event listener for header close buttons
    tabulator.on('tableBuilt', () => {
      const headers = tableDiv.value?.querySelectorAll('.header-close-btn')
      headers?.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation() // Prevent sorting
          const field = (e.target as HTMLElement).getAttribute('data-field') as SummaryColumnField
          if (field) {
            hideColumnFromHeader(field)
          }
        })
      })
    })

    tabulator.on('cellContext', (e: any, cell: any) => {
      e.preventDefault()
      const row = cell.getRow();
      const data = row.getData();
      const element = row.getElement();

      // Detect Tabulator's bottomCalc row by CSS class
      const isBottomCalc = element && element.classList.contains('tabulator-calcs');

      // Show total context menu for NLV/Maintenance columns in bottomCalc row
      if (isBottomCalc && (cell.getField() === 'nlv_val' || cell.getField() === 'maintenance_val')) {
        showTotalContextMenu(e, cell.getField());
        return;
      }

      // Otherwise, use your normal logic for account rows
      if (data && data.nlv_internal_account_id !== undefined) {
        showContextMenu(
          e,
          typeof data.nlv_internal_account_id === 'string'
            ? parseInt(data.nlv_internal_account_id)
            : data.nlv_internal_account_id,
          cell.getField()
        );
      }
    })

    syncActiveSummaryFiltersFromGrid()
  } catch (error) {
    console.error('Error creating Tabulator:', error)
  }
}

// Add function to hide column from header
function hideColumnFromHeader(field: SummaryColumnField) {
  const index = summaryVisibleCols.value.indexOf(field)
  if (index > -1) {
    summaryVisibleCols.value.splice(index, 1)
    writeSummaryVisibleColsToUrl(summaryVisibleCols.value)
    
    // Rebuild table with new columns
    nextTick(() => {
      initializeTabulator()
    })
  }
}

// 4. UPDATE gridRowData to include account field
const gridRowData = computed(() => {
  if (!calculatedMetrics.value) return []
  
  const rows = filteredMetrics.value.map(item => ({
    ...item,
    account: item.legal_entity,
    isTotal: false
  }))

  /*if (!selectedClientFromUrl.value && allAccountsSummary.value && activeSummaryFilters.value.length === 0) {
    rows.push({
      account: 'All Accounts',
      nlv_val: allAccountsSummary.value.totalNlv,
      maintenance_val: allAccountsSummary.value.totalMaintenance,
      excess_maintenance_margin: allAccountsSummary.value.totalExcessMaintenance,
      addlGmvAllowedNlvSide: allAccountsSummary.value.totalAddlGmvToStopReducing,
      addlGmvAllowedMaintenanceSide: allAccountsSummary.value.totalAddlGmvToStartReducing,
      isTotal: true
    } as any)
  }*/

  return rows
})

// 5. UPDATE filter sync function
function syncActiveSummaryFiltersFromGrid() {
  const next: ActiveSummaryFilter[] = []
  
  if (tabulator) {
    const filters = tabulator.getFilters()
    for (const filter of filters) {
      if (filter.field === 'account' && filter.value) {
        next.push({ field: 'account', value: String(filter.value) })
      }
    }
  }
  
  activeSummaryFilters.value = next
}

// 6. UPDATE handleSummaryAccountCellFilterClick
function handleSummaryAccountCellFilterClick(value: any) {
  if (!tabulator || value === undefined || value === null) return
  
  // Clear existing filters first
  tabulator.clearFilter()
  
  // Set new filter with correct syntax
  tabulator.setFilter([
    { field: 'account', type: '=', value: String(value) }
  ])
  
  syncActiveSummaryFiltersFromGrid()
  
  const url = new URL(window.location.href)
  url.searchParams.set(`${props.window}_all_cts_clientId` , String(value))
  window.history.replaceState({}, '', url.toString())
  
  if (eventBus) {
    eventBus.emit('account-filter-changed', {
      accountId: String(value),
      source: 'summary'
    })
  }
}

// 7. UPDATE clearSummaryFilter
function clearSummaryFilter(field: 'account') {
  if (!tabulator) return
  
  const hadFilter = tabulator.getFilters().some(f => f.field === field)
  
  // Clear all filters
  tabulator.clearFilter()
  
  syncActiveSummaryFiltersFromGrid()
  
  // Clear the URL parameter
  const url = new URL(window.location.href)
  url.searchParams.delete(`${props.window}_all_cts_clientId`)
  window.history.replaceState({}, '', url.toString())
  
  // Clear the local state
  selectedClientFromUrl.value = null
  
  // Emit event to notify other components
  if (hadFilter && eventBus) {
    eventBus.emit('account-filter-changed', {
      accountId: null,
      source: 'summary'
    })
  }
  
  // Refresh the table data to show all accounts
  nextTick(() => {
    if (tabulator) {
      tabulator.replaceData(gridRowData.value)
    }
  })
}

// 8. UPDATE clearAllSummaryFilters
function clearAllSummaryFilters() {
  if (!tabulator) return
  
  const hadAccountFilter = tabulator.getFilters().some(f => f.field === 'account')
  
  tabulator.clearFilter()
  syncActiveSummaryFiltersFromGrid()
  
  const url = new URL(window.location.href)
  url.searchParams.delete(`${props.window}_all_cts_clientId`)
  window.history.replaceState({}, '', url.toString())
  
  if (hadAccountFilter && eventBus) {
    eventBus.emit('account-filter-changed', {
      accountId: null,
      source: 'summary'
    })
  }
}

// 9. UPDATE handleExternalAccountFilter
function handleExternalAccountFilter(payload: { accountId: string | null, source: string }) {
  if (payload.source === 'summary' || !tabulator) return
  
  if (payload.accountId) {
    tabulator.setFilter([
      { field: 'account', type: '=', value: payload.accountId }
    ])
  } else {
    tabulator.clearFilter()
  }
  
  syncActiveSummaryFiltersFromGrid()
}

// 10. UPDATE setSummaryColumnVisibility - can be simplified or removed since we're rebuilding
function setSummaryColumnVisibility(field: string, visible: boolean) {
  // This function is no longer needed since we rebuild the table
  // Keep it for now in case there are other references, but it won't be used
  if (!tabulator) return
  
  try {
    if (visible) {
      tabulator.showColumn(field)
    } else {
      tabulator.hideColumn(field)
    }
  } catch (error) {
    console.warn('Could not set column visibility:', error)
  }
}

// 11. UPDATE watchers for data and column changes
watch([() => q.data.value, selectedClientFromUrl], () => {
  if (!tabulator) return
  
  nextTick(() => {
    tabulator.replaceData(gridRowData.value)
  })
})

watch(summaryVisibleCols, (cols) => {
  writeSummaryVisibleColsToUrl(cols)
  
  // Rebuild table instead of trying to show/hide columns
  nextTick(() => {
    initializeTabulator()
  })
}, { deep: true })

// 12. UPDATE onMounted
onMounted(() => {
  selectedClientFromUrl.value = getUrlParams()
  
  window.addEventListener('popstate', () => {
    selectedClientFromUrl.value = getUrlParams()
  })

  document.addEventListener('click', hideContextMenu)
  document.addEventListener('click', handleSummaryClickOutside)
  
  scheduleContainerPolling()
  
  if (eventBus) {
    eventBus.on('account-filter-changed', handleExternalAccountFilter)
  }

  // Initialize Tabulator after DOM is ready
  nextTick(() => {
    if (q.isSuccess.value) {
      initializeTabulator()
    }
  })
})

// 13. ADD watch for query success
watch(() => q.isSuccess.value, (isSuccess) => {
  if (isSuccess) {
    nextTick(() => {
      initializeTabulator()
    })
  }
})

// 14. UPDATE onBeforeUnmount
onBeforeUnmount(() => {
  if (tabulator) {
    try { tabulator.destroy() } catch (error) {}
    tabulator = null
  }
  
  document.removeEventListener('click', hideContextMenu)
  document.removeEventListener('click', handleSummaryClickOutside)
  
  pollTimers.forEach(t => clearInterval(t))
  pollTimers.length = 0
  
  if (eventBus) {
    eventBus.off('account-filter-changed', handleExternalAccountFilter)
  }
})

// REMOVE these AG Grid specific functions:
// - onGridReady
// - columnDefs computed
// - regularRowData computed
// - pinnedBottomRowData computed
// - isRowPinned function
// - Any watch on gridApi.value

// 15. REPLACE AG Grid with Tabulator div

// Context menu state
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  accountId: null as number | null,
  columnId: null as string | null,
  fetchedAt: null as string | null
})

// Active filters for Summary
type ActiveSummaryFilter = { field: 'account'; value: string }
const activeSummaryFilters = ref<ActiveSummaryFilter[]>([])

// Context menu functions
function showContextMenu(e: MouseEvent, accountId: number, columnId: string) {
  const item = calculatedMetrics.value?.find(m => {
    const mAccountId = typeof m.nlv_internal_account_id === 'string' 
      ? parseInt(m.nlv_internal_account_id) 
      : m.nlv_internal_account_id
    return mAccountId === accountId
  })
  
  contextMenu.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    accountId,
    columnId,
    fetchedAt: item?.fetched_at_val || null
  }
}

function hideContextMenu() {
  contextMenu.value.visible = false
}

// Context menu items computed property
const contextMenuItems = computed(() => {
  console.log('🔍 Computing context menu items for accountId:', contextMenu.value.accountId, 'columnId:', contextMenu.value.columnId)
  if (typeof contextMenu.value.accountId === 'undefined') return []
  
  const items = []
  
  // Always show "Details" option
  items.push({
    icon: '📋',
    label: 'Details',
    action: 'details',
    active: breakdownVisibility[contextMenu.value.accountId] || false
  })
  
  // Show graph options for NLV and Maintenance columns
  const colId = contextMenu.value.columnId
  if (colId === 'nlv_val') {
    items.push({
      icon: '📊',
      label: 'NLV Graph',
      action: 'nlv_graph',
      active: isGraphActive(contextMenu.value.accountId, 'nlv')
    })
  } else if (colId === 'maintenance_val') {
    items.push({
      icon: '📈',
      label: 'Maintenance Graph',
      action: 'mm_graph',
      active: isGraphActive(contextMenu.value.accountId, 'mm')
    })
  }
  
  if (contextMenu.value.accountId) {
    items.push({
      icon: '✏️',
      label: 'Rename Account',
      action: 'rename_account'
    })
  }

  if (contextMenu.value.accountId === null) {
    // Total row context menu
    const items = []
    if (contextMenu.value.columnId === 'nlv_val') {
      items.push({
        icon: '📊',
        label: 'Total NLV Graph',
        action: 'total_nlv_graph',
        active: showTotalGraph.value && totalGraphType.value === 'nlv'
      })
    } else if (contextMenu.value.columnId === 'maintenance_val') {
      items.push({
        icon: '📈',
        label: 'Total Maintenance Graph',
        action: 'total_mm_graph',
        active: showTotalGraph.value && totalGraphType.value === 'mm'
      })
    }
    return items
  }

  const item = calculatedMetrics.value?.find(m => {
    const mAccountId = typeof m.nlv_internal_account_id === 'string' 
      ? parseInt(m.nlv_internal_account_id) 
      : m.nlv_internal_account_id
    return mAccountId === contextMenu.value.accountId
  })

  if (item) {
    items.push({
      icon: item.archived ? '♻️' : '🗄️',
      label: item.archived ? 'Recover Client' : 'Archive Client',
      action: item.archived ? 'recover_client' : 'archive_client'
    })
  }
  
  return items
})

// Helper to check if a graph is active
function isGraphActive(accountId: number, type: 'nlv' | 'mm'): boolean {
  return selectedAccountForHistory.value === accountId && selectedGraphType.value === type
}

// Handle context menu actions
function handleContextMenuAction(action: string) {
  if (action === 'total_nlv_graph') {
    showTotalGraph.value = !showTotalGraph.value || totalGraphType.value !== 'nlv'
    totalGraphType.value = 'nlv'
    hideContextMenu()
    return
  }
  if (action === 'total_mm_graph') {
    showTotalGraph.value = !showTotalGraph.value || totalGraphType.value !== 'mm'
    totalGraphType.value = 'mm'
    hideContextMenu()
    return
  }

  const accountId = contextMenu.value.accountId
  if (!accountId) return
  
  switch (action) {
    case 'details':
      toggleBreakdown(accountId)
      break
    case 'nlv_graph':
      toggleGraph(accountId, 'nlv')
      break
    case 'mm_graph':
      toggleGraph(accountId, 'mm')
      break
    case 'archive_client':
      archiveClient(contextMenu.value.accountId?.toString() || '')
      break
    case 'recover_client':
      recoverClient(contextMenu.value.accountId?.toString() || '')
      break
    case 'rename_account': {
      // Find the account row
      const accountRow = calculatedMetrics.value?.find(m => {
        const mAccountId = typeof m.nlv_internal_account_id === 'string' 
          ? parseInt(m.nlv_internal_account_id) 
          : m.nlv_internal_account_id
        return mAccountId === accountId
      })
      openRenameAccountDialog(
        accountRow?.nlv_internal_account_id?.toString() || '',
        accountRow?.legal_entity || ''
      )
      break
    }
  }
  
  hideContextMenu()
}

// Toggle graph visibility
function toggleGraph(accountId: number, type: 'nlv' | 'mm') {
  // If clicking the same graph that's already open, close it
  if (selectedAccountForHistory.value === accountId && selectedGraphType.value === type) {
    selectedAccountForHistory.value = null
    selectedGraphType.value = null
  } else {
    // Otherwise, open the new graph
    selectedAccountForHistory.value = accountId
    selectedGraphType.value = type
  }
}

// Current history query computed property
const currentHistoryQuery = computed(() => {
  if (!selectedGraphType.value) return null
  return selectedGraphType.value === 'nlv' ? nlvHistoryQuery : maintenanceHistoryQuery
})

// Chart data for Chart.js
const chartData = computed(() => {
  const query = currentHistoryQuery.value
  if (!query?.data.value?.length) return null
  
  const data = query.data.value
  const isNlv = selectedGraphType.value === 'nlv'
  
  return {
    labels: data.map((item: any) => {
      const date = new Date(item.fetched_at)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: isNlv ? 'NLV' : 'Maintenance Margin',
        data: data.map((item: any) => isNlv ? item.nlv : item.maintenance),
        borderColor: isNlv ? '#3b82f6' : '#10b981',
        backgroundColor: isNlv ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

const totalChartData = computed(() => {
  let query = null
  if (totalGraphType.value === 'nlv') query = totalNlvHistoryQuery
  if (totalGraphType.value === 'mm') query = totalMaintenanceHistoryQuery
  if (!query?.data.value?.length) return null
  const data = query.data.value
  const isNlv = totalGraphType.value === 'nlv'
  return {
    labels: data.map((item: any) => {
      const date = new Date(item.fetched_at)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: isNlv ? 'Total NLV' : 'Total Maintenance Margin',
        data: data.map((item: any) => isNlv ? item.total : item.total),
        borderColor: isNlv ? '#3b82f6' : '#10b981',
        backgroundColor: isNlv ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: function(value: any) {
          return formatCurrency(value)
        }
      }
    }
  }
}

// Format timestamp to PST
function formatToPST(timestamp: string | null): string {
  if (!timestamp) return 'N/A'
  
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

// Docker container management functions
const pollTimers: number[] = []

function getContainerNameFromAccountId(clientNumber: number): string {
  const containerMap: { [key: number]: string } = {
    1: 'bansi',
    2: 'cis',
    3: 'hediye',
    4: 'ovlg',
    5: 'sc',
    6: 'stamp',
    7: 'vk',
    8: 'jkmdm'
  }
  return containerMap[clientNumber] || ''
}

function getContainerDisplay(clientNumber: number): { online: boolean; lastUpdated?: Date | null } {
  const containerName = getContainerNameFromAccountId(clientNumber)
  const state = containerStates[containerName]
  return {
    online: state?.online || false,
    lastUpdated: state?.lastUpdated || null
  }
}

async function checkContainerStatus(containerName: string) {
  const state = containerStates[containerName]
  if (!state) return
  
  state.isLoading = true
  
  try {
    const url = containerName === 'vk' 
    ? `https://ibkr.vk.to5001.aiworkspace.pro/api/maintenance`
    : `https://ibkr.${containerName}.to5001.aiworkspace.pro/api/maintenance`
    const response = await fetch(url) 
    const data = await response.json()
    //console.log(`Checked ${containerName} status:`, data)
    if (data.maintenance_margin_amount) {
      state.online = true
      state.lastUpdated = new Date()
      state.lastError = null
    } else {
      state.lastError = data.error || 'Unknown error'
    }
  } catch (error) {
    //console.error(`Error checking ${containerName} status:`, error)
    state.online = false
    state.lastUpdated = new Date()
    state.lastError = String(error)
  } finally {
    state.isLoading = false
  }
}

async function startDockerContainer(containerName: string) {
  const state = containerStates[containerName]
  if (!state) return
  
  state.isStarting = true
  state.isLoading = true
  
  try {
    const response = await fetch(`${DOCKER_CONTROL_URL}?action=start&container_name=${containerName}`)
    const data = await response.json()
    
    if (data.status === 'success') {
      showNotification('success', `Container ${containerName} started successfully`)
      await checkContainerStatus(containerName)
    } else {
      showNotification('error', `Failed to start ${containerName}: ${data.error}`)
    }
  } catch (error) {
    showNotification('error', `Error starting ${containerName}: ${error}`)
  } finally {
    state.isStarting = false
    state.isLoading = false
  }
}

async function stopDockerContainer(containerName: string) {
  const state = containerStates[containerName]
  if (!state) return
  
  state.isStopping = true
  state.isLoading = true
  
  try {
    const response = await fetch(`${DOCKER_CONTROL_URL}?action=stop&container_name=${containerName}`)
    const data = await response.json()
    
    if (data.status === 'success') {
      showNotification('success', `Container ${containerName} stopped successfully`)
      await checkContainerStatus(containerName)
    } else {
      showNotification('error', `Failed to stop ${containerName}: ${data.error}`)
    }
  } catch (error) {
    showNotification('error', `Error stopping ${containerName}: ${error}`)
  } finally {
    state.isStopping = false
    state.isLoading = false
  }
}

function scheduleContainerPolling() {
  // Check all containers every 30 seconds
  const containerNames = Object.keys(containerStates)
  
  containerNames.forEach(name => {
    checkContainerStatus(name)
    const timer = setInterval(() => checkContainerStatus(name), 30000) as unknown as number
    pollTimers.push(timer)
  })
}

function showNotification(type: 'success' | 'error', message: string) {
  const id = notificationIdCounter++
  notifications.value.push({ id, type, message })
  setTimeout(() => removeNotification(id), 5000)
}

function removeNotification(id: number) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

// Add URL parameter helpers for column widths
function parseSummaryColumnWidthsFromUrl(): Record<string, number> {
  const url = new URL(window.location.href)
  const widthsParam = url.searchParams.get(`${props.window}_summary_col_widths`)
  if (!widthsParam) return {}
  
  try {
    const pairs = widthsParam.split('-and-')
    const widths: Record<string, number> = {}
    pairs.forEach(pair => {
      const [field, width] = pair.split(':')
      if (field && width) {
        widths[field] = parseInt(width)
      }
    })
    return widths
  } catch (error) {
    console.warn('Error parsing column widths from URL:', error)
    return {}
  }
}

function writeSummaryColumnWidthsToUrl(widths: Record<string, number>) {
  const url = new URL(window.location.href)
  const widthPairs = Object.entries(widths)
    .filter(([_, width]) => width > 0)
    .map(([field, width]) => `${field}:${width}`)
    .join('-and-')
  
  if (widthPairs) {
    url.searchParams.set(`${props.window}_summary_col_widths`, widthPairs)
  } else {
    url.searchParams.delete(`${props.window}_summary_col_widths`)
  }
  window.history.replaceState({}, '', url.toString())
}

// Store column widths
const summaryColumnWidths = ref<Record<string, number>>(parseSummaryColumnWidthsFromUrl())

const showRenameDialog = ref(false)
const renameAccountId = ref<string | null>(null)
const renameAccountCurrent = ref<string>('')
const renameAccountValue = ref<string>('')

function openRenameAccountDialog(accountId: string, currentName: string) {
  renameAccountId.value = accountId
  renameAccountCurrent.value = currentName
  renameAccountValue.value = currentName
  showRenameDialog.value = true // <-- FIXED
}

async function saveAccountAlias() {
  if (!props.userId || !renameAccountId.value) return
  try {
    const { error } = await supabase
      .schema('hf')
      .from('user_account_alias')
      .upsert({
        user_id: props.userId,
        internal_account_id: renameAccountId.value,
        alias: renameAccountValue.value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,internal_account_id' })
    if (error) throw error
    showRenameDialog.value = false
    await queryClient.invalidateQueries() // or just the summary query key
    showNotification('success', 'Account renamed')
  } catch (err: any) {
    showNotification('error', err.message)
  }
}

// Screenshot functionality
const showScreenshotsModal = ref(false)
const screenshots = ref<any[]>([])
const previewScreenshot = ref<any | null>(null)
const screenshotsLoading = ref(false)
const takingScreenshot = ref(false)
const showScreenshotNameModal = ref(false)
const screenshotName = ref('')
const showScreenshotRenameModal = ref(false)
const screenshotRenameValue = ref('')
const screenshotRenameId = ref<number | null>(null)

// Open name modal
function promptScreenshotName() {
  screenshotName.value = ''
  showScreenshotNameModal.value = true
}

// Actual screenshot save (called after user confirms name)
async function takeScreenshotConfirmed() {
  if (!tableDiv.value) {
    showScreenshotNameModal.value = false
    return
  }
  showScreenshotNameModal.value = false
  takingScreenshot.value = true
  try {
    const canvas = await html2canvas(tableDiv.value)
    const base64 = canvas.toDataURL('image/png')

    const { error } = await supabase
      .schema('hf')
      .from('summary_screenshots')
      .insert([{
        user_id: props.userId,
        created_at: new Date().toISOString(),
        image_data: base64.replace(/^data:image\/png;base64,/, ''),
        name: screenshotName.value ? screenshotName.value.trim() : null,
        archived: false,
        meta: {
          filters: {
            account: activeSummaryFilters.value,
            columns: allSummaryColumnOptions.filter(col => summaryVisibleCols.value.includes(col.field as SummaryColumnField)).map(col => col.field)
          }
        }
      }])
    if (error) throw error

    showToast('success', 'Screenshot saved!')
    fetchScreenshots()
  } catch (err: any) {
    showToast('error', 'Screenshot failed', err.message)
  } finally {
    takingScreenshot.value = false
  }
}

// Mark screenshot archived (soft-delete)
async function archiveScreenshot(id: number) {
  try {
    const { error } = await supabase
      .schema('hf')
      .from('summary_screenshots')
      .update({ archived: true })
      .eq('id', id)
    if (error) throw error
    showToast('success', 'Screenshot archived')
    fetchScreenshots()
  } catch (err: any) {
    showToast('error', 'Archive failed', err.message)
  }
}

// Update fetchScreenshots to ignore archived items
async function fetchScreenshots() {
  if (!props.userId) {
    screenshots.value = []
    return
  }
  screenshotsLoading.value = true
  const { data, error } = await supabase
    .schema('hf')
    .from('summary_screenshots')
    .select('*')
    .eq('user_id', props.userId)
    .eq('archived', false)             // <-- only non-archived
    .order('created_at', { ascending: false })
    .limit(20)
  if (!error) screenshots.value = data || []
  screenshotsLoading.value = false
}

// Toast system
type ToastType = 'success' | 'error' | 'warning' | 'info'
interface Toast {
  id: number
  type: ToastType
  title: string
  message?: string
}
const toasts = ref<Toast[]>([])
let toastIdCounter = 0
function showToast(type: ToastType, title: string, message?: string) {
  const id = toastIdCounter++
  toasts.value.push({ id, type, title, message })
  setTimeout(() => removeToast(id), 5000)
}
function removeToast(id: number) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) toasts.value.splice(index, 1)
}
function openScreenshotRenameModal(shot: any) {
  screenshotRenameId.value = shot.id
  screenshotRenameValue.value = shot.name || ''
  showScreenshotRenameModal.value = true
}

async function saveScreenshotRename() {
  if (!screenshotRenameId.value) return
  try {
    const { error } = await supabase
      .schema('hf')
      .from('summary_screenshots')
      .update({ name: screenshotRenameValue.value })
      .eq('id', screenshotRenameId.value)
    if (error) throw error
    showScreenshotRenameModal.value = false
    showToast('success', 'Screenshot renamed')
    fetchScreenshots()
  } catch (err: any) {
    showToast('error', 'Rename failed', err.message)
  }
}

watch(showScreenshotsModal, (open) => {
  if (open) fetchScreenshots()
})

// Add state for total row graph
const showTotalGraph = ref(false)
const totalGraphType = ref<'nlv' | 'mm' | null>(null)

// Supabase queries for total row graphs
const totalNlvHistoryQuery = useQuery({
  queryKey: ['totalNlvHistory'],
  queryFn: async () => {
    const { data, error } = await supabase.schema('hf').rpc('get_nlv_run_summaries')
    if (error) throw error
    return data || []
  },
  enabled: computed(() => showTotalGraph.value && totalGraphType.value === 'nlv')
})

const totalMaintenanceHistoryQuery = useQuery({
  queryKey: ['totalMaintenanceHistory'],
  queryFn: async () => {
    const { data, error } = await supabase.schema('hf').rpc('get_maintenance_run_summaries')
    if (error) throw error
    return data || []
  },
  enabled: computed(() => showTotalGraph.value && totalGraphType.value === 'mm')
})

// Helper for total row context menu
function showTotalContextMenu(e: MouseEvent, columnId: string) {
  contextMenu.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    accountId: null, // No accountId for total row
    columnId,
    fetchedAt: null
  }
}

// Add a computed to detect manual sync accounts
const manualSyncAccounts = computed(() => {
  // You may need to fetch sync_mode from user_accounts_master
  // For now, assume calculatedMetrics includes sync_mode
  return new Set(
    calculatedMetrics.value
      .filter(item => item.sync_mode === 'manual')
      .map(item => item.nlv_internal_account_id)
  )
})

// Add state for editing
const editingAccountId = ref<string | null>(null)
const editNlvValue = ref<number | null>(null)
const editMaintenanceValue = ref<number | null>(null)

// Function to open edit modal
function openEditModal(accountId: string, nlv: number, maintenance: number) {
  editingAccountId.value = accountId
  editNlvValue.value = nlv
  editMaintenanceValue.value = maintenance
}

// Function to save edits
async function saveManualEdit() {
  if (!editingAccountId.value) return
  try {
    const now = new Date().toISOString()
    // Insert new netliquidation row
    await supabase
      .schema('hf')
      .from('netliquidation')
      .insert([{
        internal_account_id: editingAccountId.value,
        nlv: editNlvValue.value,
        fetched_at: now
      }])
    // Insert new maintenance_margin row
    await supabase
      .schema('hf')
      .from('maintenance_margin')
      .insert([{
        internal_account_id: editingAccountId.value,
        maintenance: editMaintenanceValue.value,
        fetched_at: now
      }])
    showToast('success', 'Values updated')
    editingAccountId.value = null
    await queryClient.invalidateQueries()
  } catch (err: any) {
    showToast('error', 'Update failed', err.message)
  }
}

async function archiveClient(accountId: string) {
  try {
    const { error } = await supabase
      .schema('hf')
      .from('user_accounts_master')
      .update({ archived: true })
      .eq('internal_account_id', accountId)
    if (error) throw error
    showToast('success', 'Client archived')
    await queryClient.invalidateQueries()
  } catch (err: any) {
    showToast('error', 'Archive failed', err.message)
  }
}

async function recoverClient(accountId: string) {
  try {
    const { error } = await supabase
      .schema('hf')
      .from('user_accounts_master')
      .update({ archived: false })
      .eq('internal_account_id', accountId)
    if (error) throw error
    showToast('success', 'Client recovered')
    await queryClient.invalidateQueries()
  } catch (err: any) {
    showToast('error', 'Recover failed', err.message)
  }
}

watch(filteredMetrics, (newVal) => {
  if (tabulator) {
    tabulator.replaceData(gridRowData.value)
  }
})
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
            <router-link v-if="showHeaderLink" to="/summary" class="summary-link">{{ appName }}</router-link>
            <span v-else>{{ appName }}</span>
            <button
              class="appname-rename-btn"
              @click="openAppNameDialog"
              title="Rename app"
              style="width:auto;padding: 2px 7px; font-size: 13px; background: none; border: none; color: #888; cursor: pointer;"
            >✎</button>
          </h2>
          <div class="header-tools">
            <button class="btn" @click="showArchivedClients = !showArchivedClients" :title="showArchivedClients ? `Hide archived clients` : `Show archived clients`">
              <span v-if="showArchivedClients">🗄️</span>
              <span v-else>📁</span>
            </button>
            <button @click="openAddClientDialog" class="btn" title="Add Client">➕</button>
            <button @click="promptScreenshotName" class="screenshot-btn" title="Take Screenshot" :disabled="takingScreenshot">
              <span v-if="takingScreenshot" class="screenshot-spinner"></span>
              <span v-else>📸</span>
            </button>
            <button @click="showScreenshotsModal = true" class="screenshot-btn" title="See Old Screenshots">🖼️</button>
            
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
            <AddClientDialog
              :show="showAddClientDialog"
              :onClose="() => showAddClientDialog = false"
              :onAdded="handleClientAdded"
            />
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

        <!-- 15. REPLACE AG Grid with Tabulator div -->
        <div ref="tableDiv" class="summary-grid"></div>

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

        <!-- Total row graph display -->
        <div v-if="showTotalGraph && totalGraphType" class="graph-section">
          <div v-if="totalGraphType === 'nlv' && totalNlvHistoryQuery.isLoading.value" class="graph-loading">
            Loading Total NLV historical data...
          </div>
          <div v-else-if="totalGraphType === 'mm' && totalMaintenanceHistoryQuery.isLoading.value" class="graph-loading">
            Loading Total Maintenance Margin historical data...
          </div>
          <div v-else-if="totalChartData" class="chart-section">
            <h4>
              {{ totalGraphType === 'nlv' ? 'Total NLV' : 'Total Maintenance Margin' }} History
            </h4>
            <div class="chart-container">
              <Line 
                :data="totalChartData" 
                :options="chartOptions" 
                :height="300"
              />
            </div>
          </div>
          <div v-else class="graph-empty">
            No historical data available
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

  <!-- Rename Account Dialog -->
  <div v-if="showRenameDialog" class="rename-dialog-backdrop">
    <div class="rename-dialog">
      <h3>Rename Account</h3>
      <input v-model="renameAccountValue" :placeholder="renameAccountCurrent" />
      <div class="dialog-actions">
        <button @click="saveAccountAlias">Save</button>
        <button @click="showRenameDialog = false">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Modal for old screenshots -->
  <div v-if="showScreenshotsModal" class="screenshots-modal">
    <div class="modal-content">
      <h3 class="screenshots-title">Past Screenshots</h3>
      <div v-if="screenshotsLoading" class="screenshots-loading">Loading screenshots...</div>
      <div v-else-if="screenshots.length === 0" class="screenshots-empty">No screenshots yet.</div>
      <div v-else class="screenshots-list-vertical">
        <div
          v-for="shot in screenshots"
          :key="shot.id"
          class="screenshot-list-item"
          @click="previewScreenshot = shot"
        >
          <img
            :src="`data:image/png;base64,${shot.image_data}`"
            class="screenshot-thumb"
            :alt="`Screenshot taken at ${new Date(shot.created_at).toLocaleString()}`"
          />
          <div class="screenshot-list-meta">
            <strong v-if="shot.name">{{ shot.name }}</strong>
            <span v-else style="color:#666; font-style:italic; display:block;">(Unnamed)</span>
            <span>
              {{
                new Date(shot.created_at).toLocaleString('en-US', {
                  timeZone: 'America/Los_Angeles',
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })
              }}
              <span style="color:#888; font-size:12px;">PST</span>
            </span>
            <div style="display:flex; gap:8px; margin-top:6px;">
              <a
                :href="`data:image/png;base64,${shot.image_data}`"
                :download="`positions-screenshot-${shot.id}.png`"
                class="screenshot-download-link"
                @click.stop
              >⬇️</a>
              <button class="screenshot-archive-btn" @click.stop="archiveScreenshot(shot.id)" title="Archive screenshot" style="background:none;border:1px solid #e9ecef;padding:4px 8px;border-radius:6px;cursor:pointer;">
                🗄️
              </button>
              <button class="screenshot-rename-btn" @click.stop="openScreenshotRenameModal(shot)" title="Rename screenshot" style="background:none;border:1px solid #e9ecef;padding:4px 8px;border-radius:6px;cursor:pointer;">
                ✏️
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-actions">
        <button @click="showScreenshotsModal = false" class="screenshots-close">Close</button>
      </div>
    </div>
    <!-- Image preview modal -->
    <div v-if="previewScreenshot" class="screenshot-preview-modal" @click.self="previewScreenshot = null">
      <div class="screenshot-preview-content">
        <img :src="`data:image/png;base64,${previewScreenshot.image_data}`" class="screenshot-full-img" />
        <div class="screenshot-preview-meta">
          <span>
            {{
              new Date(previewScreenshot.created_at).toLocaleString('en-US', {
                timeZone: 'America/Los_Angeles',
                dateStyle: 'medium',
                timeStyle: 'short'
              })
            }}
            <span style="color:#888; font-size:12px;">PST</span>
          </span>
          <a
            :href="`data:image/png;base64,${previewScreenshot.image_data}`"
            :download="`positions-screenshot-${previewScreenshot.id}.png`"
            class="screenshot-download-link"
          >⬇️ Download</a>
          <button @click="previewScreenshot = null" class="screenshot-preview-close">Close</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showScreenshotNameModal" class="rename-dialog-backdrop">
    <div class="rename-dialog">
      <h3>Name screenshot</h3>
      <input v-model="screenshotName" placeholder="Enter a name (optional)" />
      <div class="dialog-actions" style="justify-content:flex-start;">
        <button @click="takeScreenshotConfirmed">Save & Capture</button>
        <button @click="showScreenshotNameModal = false">Cancel</button>
      </div>
    </div>
  </div>

  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✅</span>
          <span v-else-if="toast.type === 'error'">❌</span>
          <span v-else-if="toast.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
      </div>
    </TransitionGroup>
  </div>

  <div v-if="showScreenshotRenameModal" class="rename-dialog-backdrop">
    <div class="rename-dialog">
      <h3>Rename Screenshot</h3>
      <input v-model="screenshotRenameValue" placeholder="Enter new name" />
      <div class="dialog-actions">
        <button @click="saveScreenshotRename">Save</button>
        <button @click="showScreenshotRenameModal = false">Cancel</button>
      </div>
    </div>
  </div>

  <div v-if="editingAccountId" class="rename-dialog-backdrop">
    <div class="rename-dialog">
      <h3>Edit NLV & Maintenance Margin</h3>
      <label>NLV:</label>
      <input type="number" v-model="editNlvValue" />
      <label>Maintenance Margin:</label>
      <input type="number" v-model="editMaintenanceValue" />
      <div class="dialog-actions">
        <button @click="saveManualEdit">Save</button>
        <button @click="editingAccountId = null">Cancel</button>
      </div>
    </div>
  </div>

  <div v-if="showAppNameDialog" class="rename-dialog-backdrop">
    <div class="rename-dialog">
      <h3>Rename App</h3>
      <input v-model="appNameInput" placeholder="App name" />
      <div class="dialog-actions">
        <button @click="saveAppName">Save</button>
        <button @click="showAppNameDialog = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style>
/* 16. ADD Tabulator CSS import at the top of style section */
@import 'tabulator-tables/dist/css/tabulator_modern.min.css';

.screenshots-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  margin-bottom: 1.5rem;
  max-height: 50vh;
  overflow-y: auto;
}
.screenshot-list-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1rem;
  border-radius: 0.7rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: background 0.15s;
}
.screenshot-list-item:hover {
  background: #e3f2fd;
}
.screenshot-thumb {
  width: 110px;
  height: 60px;
  object-fit: contain;
  border-radius: 0.4rem;
  border: 1px solid #ccc;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.screenshot-list-meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 15px;
  color: #555;
}
.screenshot-download-link {
  color: #1976d2;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.05em;
  margin-top: 2px;
  transition: color 0.18s;
}
.screenshot-download-link:hover {
  color: #0d47a1;
  text-decoration: underline;
}

/* Preview modal */
.screenshot-preview-modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45); z-index: 100000;
  display: flex; align-items: center; justify-content: center;
}
.screenshot-preview-content {
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 90vh;
}
.screenshot-full-img {
  max-width: 80vw;
  max-height: 60vh;
  border-radius: 0.7rem;
  border: 1.5px solid #e9ecef;
  margin-bottom: 1.2rem;
  background: #f8f9fa;
}
.screenshot-preview-meta {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.1em;
  color: #444;
}
.screenshot-preview-close {
  margin-left: 1.5rem;
  padding: 0.4rem 1.2rem;
  border-radius: 7px;
  border: 1.5px solid #007bff;
  background: #007bff;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.screenshot-preview-close:hover {
  background: #0056b3;
  border-color: #0056b3;
}
button.screenshot-btn {
    background: transparent;
    padding: 2px 2px;
    border: 1px solid #dee2e6;
}
.screenshot-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.screenshot-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #e3e3e3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: screenshot-spin 0.7s linear infinite;
  vertical-align: middle;
}
@keyframes screenshot-spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
/* Toast notification styles */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  min-width: 300px;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border-left: 4px solid #28a745;
}

.toast-error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.toast-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border-left: 4px solid #ffc107;
}

.toast-info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
  border-left: 4px solid #17a2b8;
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
  line-height: 1;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

/* Toast animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
.screenshots-modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25); z-index: 99999;
  display: flex; align-items: center; justify-content: center;
}
.screenshots-modal .modal-content {
  background: #fff; padding: 1rem; border-radius: 1rem; min-width: 350px; max-width: 90vw;
}
.screenshots-list { display: flex; flex-wrap: wrap; gap: 1rem; }
.screenshot-item { max-width: 220px; }
.screenshot-meta { font-size: 12px; color: #888; margin-top: 4px; }
button.edit-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    width: auto;
    padding: 0 3px;
}
</style>

<style scoped>
/* Update the breakdown section styles */
.calculation-breakdown {
  margin-top: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
}

.breakdown-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.breakdown-header-left > div:first-child {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.breakdown-header-left > div:last-child {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.breakdown-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.breakdown-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.breakdown-stage {
  padding: 1.5rem;
}

.breakdown-stage.stage-1 {
  border-right: 1px solid #e5e7eb;
  background: #fffbeb;
}

.breakdown-stage.stage-2 {
  background: #fef2f2;
}

.stage-header {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid currentColor;
}

.breakdown-stage.stage-1 .stage-header {
  color: #f59e0b;
  border-color: #fbbf24;
}

.breakdown-stage.stage-2 .stage-header {
  color: #dc2626;
  border-color: #f87171;
}

.stage-item {
  margin-bottom: 1.25rem;
}

.stage-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.item-value {
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.formula {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  color: #1f2937;
  display: block;
  line-height: 1.6;
}

/* Docker control section styles */
.docker-control-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.container-status-badge {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-online {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.status-offline {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.docker-control-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.start-btn {
  background: #10b981;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background: #059669;
}

.stop-btn {
  background: #ef4444;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background: #dc2626;
}

.docker-control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 17. UPDATE grid styles - REMOVE all AG Grid specific styles */
/* REMOVE all :deep(.ag-*) styles */

.summary-grid {
  margin-top: 1rem;
  height: auto;
  min-height: 200px;
}

/* 18. ADD Tabulator specific styles */
:deep(.tabulator) {
  background: white;
  border: 1px solid #dee2e6;
  font-size: 14px;
}

:deep(.tabulator-header) {
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  padding-left: 0 !important;
}

:deep(.tabulator-col) {
  border-right: 1px solid #dee2e6;
  /*padding: 8px;*/
}

:deep(.tabulator-cell) {
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
  padding: 4px;
}

:deep(.tabulator-row:hover) {
  background-color: #f8f9fa;
}

:deep(.tabulator-row.tabulator-calcs) {
  background-color: #f8f9fa;
  font-weight: bold;
  border-top: 2px solid #dee2e6;
}

:deep(.account-cell) {
  display: flex;
  gap: 4px;
}

:deep(.account-name) {
  font-weight: 600;
  color: #1f2a37;
}

:deep(.clickable-account .account-name) {
  cursor: pointer;
}

:deep(.clickable-account .account-name:hover) {
  color: #3b82f6;
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

/*:deep(.cell-with-graph) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}*/

:deep(.negative) {
  color: #dc3545;
}

:deep(.total-cell) {
  font-weight: 700;
}

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

/* Header close button styles */
:deep(.header-with-close) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

:deep(.header-close-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
}

:deep(.header-close-btn:hover) {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

:deep(.header-close-btn:active) {
  background: rgba(239, 68, 68, 0.2);
}

/* Rename Account Dialog Styles */
.rename-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.rename-dialog {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-width: 90%;
}

.rename-dialog h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.rename-dialog input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
  color: #374151;
  margin-bottom: 1rem;
}

.rename-dialog .dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.rename-dialog button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.rename-dialog button:hover {
  background: #f3f4f6;
}

.rename-dialog button:active {
  background: #e5e7eb;
}

.rename-dialog button:first-child {
  background: #007bff;
  color: white;
}

.rename-dialog button:first-child:hover {
  background: #0056b3;
}

.rename-dialog button:first-child:active {
  background: #004085;
}
.rename-dialog-backdrop {
  position: fixed !important;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 99999 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rename-dialog {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  z-index: 100000 !important;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.dialog-actions button {
  width: auto;
  margin: 5px 4px;
  padding: 8px 10px;
}
button.btn {
    cursor: pointer;
    width: auto;
    padding: 2px 5px;
    background: transparent;
    border: 1px solid #dee2e6;
}
</style>