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
  showHeaderLink: false
})

const emit = defineEmits<{
  'minimize': []
}>()

// Grid refs
const gridApi = ref<GridApi | null>(null)
const columnApiRef = ref<ColumnApi | null>(null)

const q = useNlvMarginQuery(10000)

// State for graph visibility and selected account
const graphVisibility: { [key: number]: { nlv: boolean; mm: boolean } } = reactive({});
const selectedAccountForHistory = ref<number | null>(null)
const selectedGraphType = ref<'nlv' | 'mm' | null>(null)

// Add missing breakdownVisibility reactive object
const breakdownVisibility: { [key: number]: boolean } = reactive({});

// Add URL parameter tracking
const selectedClientFromUrl = ref<string | null>(null)

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

    // Add right-click event listener
    gridElement.addEventListener('contextmenu', (event: Event) => {
      const target = event.target as HTMLElement;
      const row = target.closest('.ag-row');
      
      if (row) {
        const rowIndex = row.getAttribute('row-index');
        if (rowIndex !== null) {
          const rowNode = gridApi.value?.getDisplayedRowAtIndex(parseInt(rowIndex));
          if (rowNode?.data && !rowNode.data.isTotal) {
            const accountId = typeof rowNode.data.nlv_internal_account_id === 'string' 
              ? parseInt(rowNode.data.nlv_internal_account_id) 
              : rowNode.data.nlv_internal_account_id;
            if (accountId) {
              showContextMenu(event as MouseEvent, accountId);
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
  accountId: null as number | null
})

// Add these missing context menu functions
function showContextMenu(event: MouseEvent, accountId: number) {
  event.preventDefault()
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    accountId
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

// Update your existing onMounted to add global click listener
onMounted(() => {
  selectedClientFromUrl.value = getUrlParams()
  
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', () => {
    selectedClientFromUrl.value = getUrlParams()
  })

  // Add global click listener to hide context menu
  document.addEventListener('click', hideContextMenu)
})

// Update your existing onBeforeUnmount
onBeforeUnmount(() => {
  if (q._cleanup) {
    q._cleanup()
  }
  
  // Remove global click listener
  document.removeEventListener('click', hideContextMenu)
})
</script>

<template>
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
            <div>Calculation breakdown for Client{{ calculatedMetrics?.findIndex(m => {
              const mAccountId = typeof m.nlv_internal_account_id === 'string' ? parseInt(m.nlv_internal_account_id) : m.nlv_internal_account_id;
              const itemAccountId = typeof item.nlv_internal_account_id === 'string' ? parseInt(item.nlv_internal_account_id) : item.nlv_internal_account_id;
              return mAccountId === itemAccountId;
            }) + 1 }}:</div>
            <div>Assumptions: maintenance margin (m) = 30%</div>
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

        <!-- Context Menu -->
        <div 
          v-if="contextMenu.visible" 
          class="context-menu"
          :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
          @click.stop
        >
          <div class="context-menu-item" @click="handleDetails">
            <span class="context-menu-icon">📋</span>
            Details
          </div>
          
          <div class="context-menu-separator"></div>
          
          <div 
            class="context-menu-item" 
            :class="{ active: contextMenu.accountId && isGraphActive(contextMenu.accountId, 'nlv') }"
            @click="handleNlvGraph"
          >
            <span class="context-menu-icon">📊</span>
            <span>NLV Graph</span>
            <span v-if="contextMenu.accountId && isGraphActive(contextMenu.accountId, 'nlv')" class="active-indicator">●</span>
          </div>
          
          <div 
            class="context-menu-item" 
            :class="{ active: contextMenu.accountId && isGraphActive(contextMenu.accountId, 'mm') }"
            @click="handleMaintenanceGraph"
          >
            <span class="context-menu-icon">📈</span>
            <span>Maintenance Margin Graph</span>
            <span v-if="contextMenu.accountId && isGraphActive(contextMenu.accountId, 'mm')" class="active-indicator">●</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  min-width: 180px;
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
}

.breakdown-header div:first-child {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2a37;
  margin-bottom: 0.5rem;
}

.breakdown-header div:last-child {
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
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
