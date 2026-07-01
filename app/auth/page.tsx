'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<'travailleur' | 'proprietaire'>('travailleur')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message)
      } else {
        router.push('/')
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, role },
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5fa0] px-8 py-8 text-center text-white">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">☢</div>
            <h1 className="text-xl font-bold">NucléoLogis</h1>
            <p className="text-blue-200 text-sm mt-1">
              {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte gratuitement'}
            </p>
          </div>

          <div className="px-8 py-6">
            {/* Mode toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'login' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
              >
                Connexion
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); setSuccess('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'register' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
              >
                Inscription
              </button>
            </div>

            {/* Role selector (inscription) */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setRole('travailleur')}
                  className={`p-3 rounded-xl border-2 text-center transition ${role === 'travailleur' ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="text-xl mb-1">🔧</div>
                  <div className="text-xs font-semibold text-gray-700">Je cherche</div>
                  <div className="text-xs text-gray-400">un logement</div>
                </button>
                <button
                  onClick={() => setRole('proprietaire')}
                  className={`p-3 rounded-xl border-2 text-center transition ${role === 'proprietaire' ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="text-xl mb-1">🏡</div>
                  <div className="text-xs font-semibold text-gray-700">Je propose</div>
                  <div className="text-xs text-gray-400">mon logement</div>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jean-Pierre Martin"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Mot de passe
                  {mode === 'login' && (
                    <button type="button" className="ml-auto float-right text-orange-500 hover:underline font-normal text-xs">
                      Oublié ?
                    </button>
                  )}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Minimum 6 caractères' : '••••••••'}
                  required
                  minLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="text-xs bg-red-50 text-red-600 rounded-lg p-3 border border-red-100">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-xs bg-green-50 text-green-700 rounded-lg p-3 border border-green-100">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60"
              >
                {loading ? '...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100"/>
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-100"/>
            </div>

            <div className="mt-3 text-center text-xs text-gray-400">
              Connexion Google / LinkedIn — bientôt disponible
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              {mode === 'login' ? (
                <>Pas encore de compte ?{' '}
                  <button onClick={() => setMode('register')} className="text-orange-500 hover:underline">S'inscrire</button>
                </>
              ) : (
                <>Déjà un compte ?{' '}
                  <button onClick={() => setMode('login')} className="text-orange-500 hover:underline">Se connecter</button>
                </>
              )}
            </p>

            {mode === 'register' && (
              <p className="text-center text-xs text-gray-300 mt-2">
                En créant un compte, vous acceptez nos{' '}
                <Link href="#" className="text-gray-400 hover:underline">CGU</Link>
                {' '}et notre{' '}
                <Link href="#" className="text-gray-400 hover:underline">politique de confidentialité</Link>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
