<script setup lang="ts">
import { onBeforeUnmount, computed, reactive, inject, ref, onMounted, watch } from 'vue'
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

const q = useNlvMarginQuery(10000)

// New state to manage the visibility of the breakdown for each client
const breakdownVisibility: { [key: number]: boolean } = reactive({});

// State for graph visibility and selected account
const graphVisibility: { [key: number]: { nlv: boolean; mm: boolean } } = reactive({});
const selectedAccountForHistory = ref<number | null>(null)
const selectedGraphType = ref<'nlv' | 'mm' | null>(null)

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
  breakdownVisibility[clientId] = !breakdownVisibility[clientId];
}

const eventBus = inject('eventBus');

function updateClientInRoute(userAccountId: number) {
  const clientIndex = calculatedMetrics.value?.findIndex(item => item.nlv_internal_account_id === userAccountId) ?? -1;
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

// Ensure the cleanup function is called when the component is unmounted
onBeforeUnmount(() => {
  if (q._cleanup) {
    q._cleanup()
  }
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
          <h2><router-link to="/summary" class="summary-link">Summary</router-link></h2>
        </div>

        <!-- All Accounts Row -->
        <div 
          v-if="allAccountsSummary" 
          class="metric-row all-accounts-row"
        >
          <div class="row-header" @click="showAllAccounts">All Accounts ({{ q.data.value?.length || 0 }})</div>
          <div class="row-content">
            <div class="metric-column">
              <div class="metric-label">Net liquidation value</div>
              <div class="metric-value">{{ formatCurrency(allAccountsSummary.totalNlv) }}</div>
              <div class="metric-label">Add'l GMV to stop-reducing cap</div>
              <div class="metric-value">{{ formatCurrency(allAccountsSummary.totalAddlGmvToStopReducing) }}</div>
            </div>
            <div class="metric-column">
              <div class="metric-label">Maintenance margin</div>
              <div class="metric-value">{{ formatCurrency(allAccountsSummary.totalMaintenance) }}</div>
              <div class="metric-label">Add'l GMV to start-reducing cap</div>
              <div class="metric-value">{{ formatCurrency(allAccountsSummary.totalAddlGmvToStartReducing) }}</div>
            </div>
          </div>
        </div>

        <!-- Individual Client Rows -->
        <div 
          v-for="(item, index) in filteredMetrics" 
          :key="`client-${item.nlv_internal_account_id}-${item.nlv_id}`" 
          class="metric-row"
        >
          <div class="row-header-button-container">
            <div class="row-header" @click="updateClientInRoute(item.nlv_internal_account_id)">
              Client{{ calculatedMetrics?.findIndex(m => m.nlv_internal_account_id === item.nlv_internal_account_id) + 1 }}
            </div>
            <button 
              :class="['row-status', item.addlGmvAllowedNlvSide < 0 && item.addlGmvAllowedMaintenanceSide < 0 ? 'stage-2-exhausted' : (item.addlGmvAllowedNlvSide < 0 ? 'stage-1-exhausted' : 'ok')]"
              @click="toggleBreakdown(item.nlv_id)"
            >
              {{ item.addlGmvAllowedNlvSide < 0 && item.addlGmvAllowedMaintenanceSide < 0 ? 'Stage 2 exhausted' : (item.addlGmvAllowedNlvSide < 0 ? 'Stage 1 exhausted' : 'OK') }}
            </button>
          </div>
          <div class="row-content">
            <div class="metric-column">
              <div class="metric-label-with-icon">
                <span class="metric-label">NLV</span>
                <button 
                  class="graph-icon" 
                  @click="toggleGraph(item.nlv_internal_account_id, 'nlv')"
                  :class="{ active: graphVisibility[item.nlv_internal_accountId]?.nlv }"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h4v8H3v-8zm6-10h4v18H9V3zm6 6h4v12h-4V9z"/>
                  </svg>
                </button>
              </div>
              <div class="metric-value">{{ formatCurrency(item.nlv_val) }}</div>
              <div class="metric-label">Add'l GMV to stop-reducing cap</div>
              <div class="metric-value">{{ formatCurrency(item.addlGmvAllowedNlvSide) }}</div>
            </div>
            <div class="metric-column">
              <div class="metric-label-with-icon">
                <span class="metric-label">Maintenance margin</span>
                <button 
                  class="graph-icon" 
                  @click="toggleGraph(item.nlv_internal_account_id, 'mm')"
                  :class="{ active: graphVisibility[item.nlv_internal_accountId]?.mm }"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h4v8H3v-8zm6-10h4v18H9V3zm6 6h4v12h-4V9z"/>
                  </svg>
                </button>
              </div>
              <div class="metric-value">{{ formatCurrency(item.maintenance_val) }}</div>
              <div class="metric-label">Add'l GMV to start-reducing cap</div>
              <div class="metric-value">{{ formatCurrency(item.addlGmvAllowedMaintenanceSide) }}</div>
            </div>
          </div>

          <!-- Chart.js Graph Display Section -->
          <div v-if="graphVisibility[item.nlv_internal_account_id]?.nlv || graphVisibility[item.nlv_internal_account_id]?.mm" class="graph-section">
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

          <!-- Calculation Breakdown Section -->
          <div v-if="breakdownVisibility[item.nlv_id]" class="calculation-breakdown">
            <div class="breakdown-header">
              <div>Calculation breakdown:</div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

/* Keep all existing styles */
.dashboard-container {
  width: 100%;
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

.metric-row {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.all-accounts-row {
  background-color: #eef2f6;
}

.row-header-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.row-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2a37;
  margin: 0;
  cursor: pointer;
}

.row-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: flex-start;
}

.metric-column {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2a37;
  margin-bottom: 1rem;
}

.row-status {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  align-self: flex-start;
  cursor: pointer;
  border: none;
  min-width: 100px;
  text-align: center;
}

.row-status.ok {
  background-color: #d1fae5;
  color: #065f46;
}

.row-status.stage-2-exhausted {
  background-color: #fee2e2;
  color: #991b1b;
}

.row-status.stage-1-exhausted {
  background-color: #fef3c7;
  color: #92400e;
}

.metric-label-with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.graph-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.graph-icon:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.graph-icon.active {
  color: #3b82f6;
  background-color: #dbeafe;
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

.calculation-breakdown {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.breakdown-header {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.breakdown-columns {
  display: flex;
  gap: 2rem;
}

.breakdown-stage {
  flex: 1;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.stage-header {
  font-weight: 600;
  color: #1f2a37;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.stage-item {
  margin-bottom: 1rem;
}

.item-label {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.item-value {
  font-weight: 600;
  color: #1f2a37;
  line-height: 1.5;
}

.formula {
  font-style: italic;
  font-size: 0.9rem;
  color: #4b5563;
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
</style>
