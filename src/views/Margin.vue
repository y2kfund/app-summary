<script setup lang="ts">
import { onBeforeUnmount, computed, reactive } from 'vue'
import { useNlvMarginQuery, type nlvMargin } from '@y2kfund/core/nlvMargin'

const q = useNlvMarginQuery(10000)

// New state to manage the visibility of the breakdown for each client
const breakdownVisibility: { [key: number]: boolean } = reactive({});

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

// Ensure the cleanup function is called when the component is unmounted
onBeforeUnmount(() => {
  if (q._cleanup) {
    q._cleanup()
  }
})


function calculateGmax(nlv: number, maintenance_margin_caled_m: number, drop_called_d: number): number {
  //console.log(nlv / (1 - (1 - drop_called_d) * (1 - maintenance_margin_caled_m)));
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
const allAccountsSummary = computed(() => {
  if (!calculatedMetrics.value) return null;
  const totalNlv = calculatedMetrics.value.reduce((sum, item) => sum + (item.nlv_val || 0), 0);
  const totalMaintenance = calculatedMetrics.value.reduce((sum, item) => sum + (item.maintenance_val || 0), 0);
  
  // These values are hardcoded for demonstration as they are not in the provided data structure.
  const totalAddlGmvToStopReducing = calculatedMetrics.value.reduce((sum, item) => sum + (item.addlGmvAllowedNlvSide || 0), 0); 
  const totalAddlGmvToStartReducing = calculatedMetrics.value.reduce((sum, item) => sum + (item.addlGmvAllowedMaintenanceSide || 0), 0); 

  return {
    totalNlv: totalNlv,
    totalMaintenance: totalMaintenance,
    totalAddlGmvToStopReducing: totalAddlGmvToStopReducing,
    totalAddlGmvToStartReducing: totalAddlGmvToStartReducing
  };
});

// Function to toggle the breakdown section visibility
function toggleBreakdown(clientId: number) {
  breakdownVisibility[clientId] = !breakdownVisibility[clientId];
}
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
          <h2>Margin</h2>
        </div>

        <div 
          v-if="allAccountsSummary" 
          class="metric-row all-accounts-row"
        >
          <div class="row-header">All Accounts ({{ q.data.value?.length || 0 }})</div>
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
            <!-- <div class="row-status ok">OK</div> -->
          </div>
        </div>

        <div 
          v-for="(item, index) in calculatedMetrics" 
          :key="item.nlv_id" 
          class="metric-row"
        >
          <div class="row-header-button-container">
            <div class="row-header">Client{{ index + 1 }}</div>
            <button 
              :class="['row-status', item.addlGmvAllowedNlvSide < 0 && item.addlGmvAllowedMaintenanceSide < 0 ? 'stage-2-exhausted' : (item.addlGmvAllowedNlvSide < 0 ? 'stage-1-exhausted' : 'ok')]"
              @click="toggleBreakdown(item.nlv_id)"
            >
              {{ item.addlGmvAllowedNlvSide < 0 && item.addlGmvAllowedMaintenanceSide < 0 ? 'Stage 2 exhausted' : (item.addlGmvAllowedNlvSide < 0 ? 'Stage 1 exhausted' : 'OK') }}
            </button>
          </div>
          <div class="row-content">
            <div class="metric-column">
              <div class="metric-label">NLV</div>
              <div class="metric-value">{{ formatCurrency(item.nlv_val) }}</div>
              <div class="metric-label">Add'l GMV to stop-reducing cap</div>
              <div class="metric-value">{{ formatCurrency(item.addlGmvAllowedNlvSide) }}</div>
            </div>
            <div class="metric-column">
              <div class="metric-label">Maintenance margin</div>
              <div class="metric-value">{{ formatCurrency(item.maintenance_val) }}</div>
              <div class="metric-label">Add'l GMV to start-reducing cap</div>
              <div class="metric-value">{{ formatCurrency(item.addlGmvAllowedMaintenanceSide) }}</div>
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
/* Main Dashboard Container */
.dashboard-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f6f8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  border-radius: 12px;
}

/* Header Section */
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

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.status.ok {
  background-color: #d1fae5;
  color: #065f46;
}

/* Individual Metric Rows */
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
}

/* Updated grid layout for content */
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

.metric-label.small, .metric-value.small {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2a37;
  margin-bottom: 0.5rem;
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

/* New CSS for the Breakdown Section */
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
</style>
