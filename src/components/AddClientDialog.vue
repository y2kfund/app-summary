<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-card">
      <h2>Add New Client</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>Client Name</label>
            <input v-model="form.legal_entity" type="text" required />
          </div>
          <div class="form-group">
            <label>Broker Account ID</label>
            <input v-model="form.broker_account_id" type="text" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Flex Query Token</label>
            <input v-model="form.flex_query_token" type="text" />
          </div>
          <div class="form-group">
            <label>All Trades Flex Query ID</label>
            <input v-model="form.all_trades_flex_query_id" type="text" />
          </div>
        </div>
        <div class="form-group">
          <label>Sync Mode</label>
          <div class="radio-group">
            <label>
              <input type="radio" value="auto" v-model="form.sync_mode" /> Auto Sync
            </label>
            <label>
              <input type="radio" value="manual" v-model="form.sync_mode" /> Manual
            </label>
          </div>
        </div>
        <div v-if="form.sync_mode === 'auto'" class="form-group">
          <label>API URL</label>
          <input v-model="form.api_url" type="text" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>NLV</label>
            <input v-model.number="form.nlv" type="number" min="0" step="any" placeholder="Net Liquidation Value" class="input-wide" />
          </div>
          <div class="form-group">
            <label>Maintenance Margin</label>
            <input v-model.number="form.maintenance" type="number" min="0" step="any" placeholder="Maintenance Margin" class="input-wide" />
          </div>
        </div>
        <div class="dialog-actions">
          <button type="submit" :disabled="loading" class="btn-primary">Add</button>
          <button type="button" @click="close" class="btn-secondary">Cancel</button>
        </div>
        <div v-if="error" class="error-msg">
          <span class="error-icon">⚠️</span> {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useSupabase } from '@y2kfund/core'

const props = defineProps<{
  show: boolean
  onClose: () => void
  onAdded: () => void
}>()

const supabase = useSupabase()
const loading = ref(false)
const error = ref('')
const form = reactive({
  legal_entity: '',
  broker_account_id: '',
  flex_query_token: '',
  all_trades_flex_query_id: '',
  sync_mode: 'manual',
  api_url: '',
  nlv: null as number | null,
  maintenance: null as number | null
})

watch(() => props.show, (val) => {
  if (val) {
    form.legal_entity = ''
    form.broker_account_id = ''
    form.flex_query_token = ''
    form.all_trades_flex_query_id = ''
    form.sync_mode = 'manual'
    form.api_url = ''
    form.nlv = null
    form.maintenance = null
    error.value = ''
  }
})

function close() {
  props.onClose()
}

async function handleSubmit() {
  error.value = ''
  if (!form.legal_entity) {
    error.value = 'Client name required'
    return
  }
  /*if (!form.broker_account_id) {
    error.value = 'Broker Account ID required'
    return
  }*/
  /*if (!form.flex_query_token) {
    error.value = 'Flex Query Token required'
    return
  }
  if (!form.all_trades_flex_query_id) {
    error.value = 'All Trades Flex Query ID required'
    return
  }*/
  if (form.sync_mode === 'auto' && !form.api_url) {
    error.value = 'API URL required for auto sync'
    return
  }
  if (!form.nlv && !form.maintenance) {
    error.value = 'Enter at least NLV or Maintenance Margin'
    return
  }

  console.log('Submitting form', form)
  loading.value = true
  try {
    // compute next internal_account_id = max(internal_account_id)+1
    // Note: table column is text, so fetch values and compute numeric max on client.
    // For large tables or concurrency safety prefer a DB-side sequence or RPC.
    const { data: ids, error: errMax } = await supabase
      .schema('hf')
      .from('user_accounts_master')
      .select('internal_account_id')
    if (errMax) throw errMax

    const maxId = (ids || []).reduce((m: number, r: any) => {
      const v = parseInt(r.internal_account_id || '0', 10)
      return Number.isFinite(v) ? Math.max(m, v) : m
    }, 0)
    const nextInternalId = String(maxId + 1)

    // Insert into user_accounts_master
    const { data, error: err1 } = await supabase
      .schema('hf')
      .from('user_accounts_master')
      .insert([{
        internal_account_id: nextInternalId,
        legal_entity: form.legal_entity,
        broker_account_id: form.broker_account_id,
        flex_query_token: form.flex_query_token,
        all_trades_flex_query_id: form.all_trades_flex_query_id,
        sync_mode: form.sync_mode,
        api_url: form.sync_mode === 'auto' ? form.api_url : null
      }])
      .select('internal_account_id')
      .single()
    if (err1) throw err1

    const internal_account_id = data?.internal_account_id
    if (!internal_account_id) throw new Error('Failed to get new account ID')

    const now = new Date().toISOString()

    // Insert into maintenance_margin if provided
    if (form.maintenance == null) {
      form.maintenance = 0
    }
    await supabase
      .schema('hf')
      .from('maintenance_margin')
      .insert([{
        internal_account_id,
        maintenance: form.maintenance,
        fetched_at: now,
        run_id_of_fetch_script: null
      }])
    
    // Insert into netliquidation if provided
    if (form.nlv == null) {
      form.nlv = 0
    }
    await supabase
      .schema('hf')
      .from('netliquidation')
      .insert([{
        internal_account_id,
        nlv: form.nlv,
        fetched_at: now,
        run_id_of_fetch_script: null
      }])

    props.onAdded()
    close()
  } catch (err: any) {
    error.value = err.message || 'Failed to add client'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(60, 60, 60, 0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  min-width: 370px;
  max-width: 420px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.18);
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
h2 {
  margin-top: 0;
  margin-bottom: 1.2rem;
  font-size: 1.35rem;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.form-row {
  display: flex;
  gap: 1.2rem;
}
.form-group {
  flex: 1;
  margin-bottom: 1.1rem;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 500;
  margin-bottom: 0.3rem;
  font-size: 0.98rem;
}
.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 0.45rem 0.7rem;
  border-radius: 5px;
  border: 1px solid #d0d0d0;
  font-size: 1rem;
  background: #fafbfc;
  transition: border 0.2s;
}
.form-group input:focus {
  border-color: #0078d4;
  outline: none;
}
.radio-group {
  display: flex;
  gap: 2.5rem;
  margin-top: 0.2rem;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.2rem;
}
.btn-primary {
  background: #0078d4;
  color: #fff;
  border: none;
  padding: 0.5rem 1.3rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-primary:disabled {
  background: #b3d3f7;
  cursor: not-allowed;
}
.btn-secondary {
  background: #f3f3f3;
  color: #333;
  border: none;
  padding: 0.5rem 1.1rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-secondary:hover {
  background: #e0e0e0;
}
.error-msg {
  color: #dc3545;
  margin-top: 0.9rem;
  text-align: center;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.error-icon {
  font-size: 1.2rem;
}
@media (max-width: 600px) {
  .modal-card {
    min-width: 90vw;
    max-width: 98vw;
    padding: 1.2rem 0.7rem;
  }
  .form-row {
    flex-direction: column;
    gap: 0.2rem;
  }
}
.input-wide {
  width: 100%;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 0.45rem 0.7rem;
  border-radius: 5px;
  border: 1px solid #d0d0d0;
  font-size: 1rem;
  background: #fafbfc;
  transition: border 0.2s;
  box-sizing: border-box;
}
.radio-group input[type="radio"] {
  width: auto;
}
</style>