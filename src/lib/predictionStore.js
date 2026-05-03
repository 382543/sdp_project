const LATEST_PREDICTION_KEY = 'ckd.latestPrediction'

export function saveLatestPrediction(payload) {
  try {
    window.localStorage.setItem(LATEST_PREDICTION_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

export function loadLatestPrediction() {
  try {
    const raw = window.localStorage.getItem(LATEST_PREDICTION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
