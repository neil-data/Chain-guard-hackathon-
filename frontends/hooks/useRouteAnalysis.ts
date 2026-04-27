'use client'
import { useState } from 'react'
import { analyzeRoute, RouteRequest, AnalysisResponse } from '@/lib/api'

// ── History helpers ──────────────────────────────────────────────────
export interface AnalysisHistoryEntry extends AnalysisResponse {
    timestamp: string
}

function saveToHistory(result: AnalysisResponse) {
    try {
        const raw = localStorage.getItem('analysisHistory')
        const history: AnalysisHistoryEntry[] = raw ? JSON.parse(raw) : []
        history.unshift({ ...result, timestamp: new Date().toISOString() })
        // Keep last 20
        localStorage.setItem('analysisHistory', JSON.stringify(history.slice(0, 20)))
    } catch {
        // localStorage might be unavailable
    }
}

export function getAnalysisHistory(): AnalysisHistoryEntry[] {
    try {
        const raw = localStorage.getItem('analysisHistory')
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function getLastAnalysis(): AnalysisResponse | null {
    try {
        const raw = localStorage.getItem('lastAnalysis')
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

// ── Hook ─────────────────────────────────────────────────────────────
export function useRouteAnalysis() {
    const [data, setData] = useState<AnalysisResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const analyze = async (req: RouteRequest) => {
        setLoading(true)
        setError(null)
        try {
            const result = await analyzeRoute(req)
            setData(result)
            // Persist
            localStorage.setItem('lastAnalysis', JSON.stringify(result))
            localStorage.setItem('lastRequest', JSON.stringify(req))
            saveToHistory(result)
            return result
        } catch (err: any) {
            setError(err.message)
            throw err              // re-throw so caller can handle
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setData(null)
        setError(null)
    }

    const loadLast = () => {
        const saved = getLastAnalysis()
        if (saved) setData(saved)
    }

    return { data, loading, error, analyze, reset, loadLast }
}